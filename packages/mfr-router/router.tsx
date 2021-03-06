import React from "react";
import {assign, DoneInvokeEvent, Machine, send} from "xstate";
import {History} from "history";
import {createDebug} from "./debug";

const debug = createDebug("router.tsx");
const trace = createDebug("router.tsx:trace");

export type Context = {
  location: History["location"];
  depth: number;
  parents: Array<string>;
  segs: Seg[];
  component: null | any;
  dataLoader: null | any;
  resolveData: ResolveData;
  routeData: {
    loading: boolean;
    data: any;
    error: string | null;
  };
};

export type ResolveData = {
  loading: boolean;
  error: string | null;
  data: ResolveDataParams;
};

// prettier-ignore
type Events =
  | { type: "xstate.init" }
  | {
  type: "HISTORY_EVT";
  location: History["location"];
  depth: number;
  matchData: MatchData;
}
  | { type: "NOTIFY_RESOLVED" };

export type MatchData = {
  path: string;
  url: string;
  isExact: boolean;
  params: Record<string, any>;
};
export type Seg = {
  key: string;
  as: string;
  importer: () => Promise<any>;
  cmp?: any;
};
export type ResolverParams = {
  location: History["location"];
  depth: number;
  parents: string[];
  segs: Seg[];
};
export type Resolver = (params: ResolverParams) => Promise<ResolveResult>;

export type DataLoader = (resolve: ResolveDataParams) => Promise<any>;

type ResolveResult = {
  component?: any;
  dataLoader?: any;
  query: Record<string, any>;
  params: Record<string, any>;
  status?: number;
};

export type ResolveDataParams = {
  query: Record<string, any>;
  params: Record<string, any>;
};

export function createRouterMachine(
  id: string,
  parents: Array<string>,
  segs: Seg[],
  depth: number,
  location: History["location"],
  resolver?: Resolver,
) {
  return Machine<Context, Record<string, any>, Events>(
    {
      id,
      initial: "resolving",
      context: {
        location,
        depth: depth,
        segs,
        parents,
        component: null,
        dataLoader: null,
        resolveData: {
          loading: false,
          data: {
            query: {},
            params: {},
          },
          error: null,
        },
        routeData: {
          loading: false,
          data: undefined,
          error: null,
        },
      },
      on: {
        HISTORY_EVT: [{target: "resolving", cond: "matchedDepth"}],
      },
      states: {
        invalid: {},
        resolving: {
          entry: ["assignResolveLoading"],
          invoke: {
            src: "resolveComponent",
            onDone: {
              target: "loadingData",
              actions: ["assignResolveData"],
            },
          },
        },
        loadingData: {
          entry: "assignDataLoading",
          invoke: {
            src: "loadData",
            onDone: {
              target: "dataLoaded",
              actions: ["assignRouteData", "notifyResolved"],
            },
          },
        },
        dataLoaded: {},
      },
    },
    {
      guards: {
        matchedDepth: (ctx, evt) => {
          return true;
        },
      },
      services: {
        resolveComponent: async (ctx, evt) => {
          if (!resolver) {
            return null;
          }
          const location = (() => {
            switch (evt.type) {
              case "xstate.init":
                return ctx.location;
              case "HISTORY_EVT": {
                return evt.location;
              }
            }
          })();
          if (!location) {
            trace("location data not found in event");
            return null;
          }
          trace("resolveComponent --> PREV=%O", ctx.component);
          trace("resolveComponent --> pathname=%O", location.pathname);
          trace("resolveComponent --> depth=%O", ctx.depth);
          trace("resolveComponent --> parents=%O", ctx.parents);
          trace("resolveComponent --> segs=%O", ctx.segs);
          const output = await resolver({
            location,
            depth: ctx.depth,
            parents: ctx.parents,
            segs: ctx.segs,
          });
          await new Promise(res => setTimeout(res, 500));
          trace("++ resolved %O", output);
          return {...output, location};
        },
        loadData: async (ctx, evt) => {
          if (!ctx.dataLoader) {
            trace("NOT loading data as %O was absent in %O", 'dataLoader');
            return null;
          }
          const output = await ctx.dataLoader(ctx.resolveData.data);
          trace("output from loadData = %O", output);
          return output;
        },
      },
      actions: {
        assignResolveData: assign({
          component: (x, evt) => {
            const e = evt as DoneInvokeEvent<ResolveResult>;
            return e.data.component;
          },
          resolveData: (ctx, evt) => {
            const e = evt as DoneInvokeEvent<ResolveResult>;
            const {component, ...rest} = e.data;
            return {
              ...ctx.resolveData,
              loading: false,
              data: rest,
            };
          },
          dataLoader: (ctx, evt) => {
            const e = evt as DoneInvokeEvent<ResolveResult>;
            return e.data.dataLoader || null;
          },
        }),
        assignResolveLoading: assign({
          resolveData: (ctx, evt) => {
            if (evt.type === "xstate.init" && import.meta.env.SSR) {
              return ctx.resolveData;
            }
            return {
              ...ctx.resolveData,
              loading: true,
            };
          },
        }),
        assignDataLoading: assign({
          routeData: (ctx) => {
            return {
              ...ctx.routeData,
              loading: true,
            };
          },
        }),
        assignRouteData: assign({
          routeData: (ctx, evt) => {
            return {
              ...ctx.routeData,
              loading: false,
              data: (evt as any).data,
            };
          },
        }),
        notifyResolved: send("NOTIFY_RESOLVED"),
      },
    },
  );
}
