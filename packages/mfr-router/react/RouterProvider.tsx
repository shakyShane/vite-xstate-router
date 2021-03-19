import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { lookup, pageLoader } from "../page-loader";
import { useMachine } from "@xstate/react";
import { createRouterMachine, DataLoader, Resolver, Seg } from "../router";
import { BaseRouterContext } from "./BaseRouterProvider";
import { v4 as uuidv4 } from "uuid";
import { Matcher } from "../router-base";
import { createDebug } from "../debug";
const debug = createDebug("RouterProvider");
const defaultParents: string[] = [];
const SHOW_LOADER = false;

export const RouterContext = createContext<{
  send: any;
  service: any;
  prev: number;
  parents: Array<string>;
}>({
  send: null,
  service: null,
  prev: 0,
  parents: defaultParents,
});

type ProviderProps = {
  resolver?: Resolver;
  fallback?: () => React.ReactNode;
  segs: Seg[];
};

export function RouterProvider(props: PropsWithChildren<ProviderProps>) {
  let { resolver } = props;
  const { segs } = props;
  if (!resolver) {
    resolver = pageLoader;
  }
  const baseRouter = useContext(BaseRouterContext);
  if (!baseRouter.send) {
    throw new Error(
      "baseRouter.send absent, likely an issue with BaseRouterContext",
    );
  }
  const {
    history,
    service: baseRouterService,
    send: baseRouterSend,
  } = baseRouter;
  const {
    send: parentSend,
    prev,
    parents,
  } = useContext(RouterContext);
  const currentDepth = parentSend === null ? 0 : prev + 1;
  const machine = useMemo(() => {
    const base = createRouterMachine(
      `router-${currentDepth}-${uuidv4().slice(0, 6)}`,
      parents,
      segs,
      currentDepth,
      history.location,
      resolver,
    );
    if (typeof window !== "undefined") return base;
    if (import.meta.env.SSR) {
      const { seg, data } = lookup({
        depth: currentDepth,
        location: history.location,
        parents,
        segs,
      });
      if (seg && seg.cmp && data) {
        debug(
          "+++ loading ssr component, key=%o, location = %o",
          seg.key,
          history.location,
        );
        return base.withContext({
          ...base.context,
          component: seg.cmp.default,
          dataLoader: seg.cmp.dataLoader,
          resolveData: {
            loading: false,
            error: null,
            data: {
              query: {},
              params: data.params,
            },
          },
        } as any);
      } else {
        debug("could NOT load SSR component, location = %O", history.location);
      }
    }
    return base;
  }, [currentDepth, history.location, parents, resolver, segs]);

  console.log("SSR machine.conxt", machine.context);

  const [state, send, service] = useMachine(machine, {
    devTools: true,
  });

  useEffect(() => {
    const matchers: Matcher[] = [];
    segs.forEach((seg) => {
      const joined = seg.as === "/"
        ? "/"
        : "/" + parents.concat(seg.as).join("/");

      matchers.push({ depth: currentDepth, path: joined });
    });
    if (typeof baseRouterSend !== "function") {
      console.warn(
        'typeof baseRouterSend !== "function"',
        baseRouterSend,
      );
    } else {
      // debug('sending matchers %o', matchers);
      baseRouterSend({ type: "REGISTER", matchers });
    }
    const listenBase = baseRouterService.subscribe((x: any) => {
      if (x.event.type === "@external.TRIGGER_RESOLVE") {
        if (x.event.depth <= currentDepth) {
          send({
            type: "HISTORY_EVT",
            location: x.event.location,
            depth: x.event.depth,
            matchData: x.event.matchData,
          });
        }
      }
    });

    return () => {
      baseRouterSend({ type: "UNREGISTER", depth: currentDepth });
      return listenBase.unsubscribe();
    };
  }, [baseRouterSend, baseRouterService, currentDepth, parents, segs, send]);

  const baseParents = useMemo(() => {
    const urlSegs = [
      ...history.location.pathname.slice(1).split("/"),
    ].filter(Boolean);
    const subject = urlSegs[currentDepth];
    const match = history.location.pathname === "/"
      ? "/"
      : segs.find((seg) => subject === seg.as);
    if (typeof match === "string") {
      return parents.concat(match);
    } else if (match) {
      return parents.concat(match.as);
    }
    return parents;
  }, [history.location.pathname, currentDepth, segs, parents]);

  const api = useMemo(() => {
    return {
      send,
      service,
      prev: currentDepth,
      parents: baseParents,
    };
  }, [send, service, currentDepth, baseParents]);

  return (
    <RouterContext.Provider value={api}>
      {state.context.component && (
        <div style={{ padding: "20px", border: "1px solid red" }}>
          {React.createElement(state.context.component)}
        </div>
      )}
      {SHOW_LOADER && state.value === "resolving" &&
        typeof window !== "undefined" && (
          <span
            style={{
              fontSize: "20px",
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "white",
              padding: "5px",
            }}
          >
            resolving route...
          </span>
        )}
      {props.children}
    </RouterContext.Provider>
  );
}

export function Outlet(props: ProviderProps) {
  return <RouterProvider {...props} />;
}
