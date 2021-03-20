import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";
import { createBrowserHistory, History } from "history";
import { Interpreter } from "xstate";
import { useMachine } from "@xstate/react";
import useConstant from "@xstate/react/lib/useConstant";
import { BaseEvt, baseMachine } from "../router-base";
// import { Context } from "../router";

export const BaseRouterContext = createContext<{
  history: History;
  send: Interpreter<any, any, BaseEvt>["send"];
  service: any;
  services: [number, Interpreter<any, any, any>][];
  mapping: Record<number, any>;
}>({
  send: null as any,
  service: null,
  history: null as any,
  services: [],
  mapping: {},
});

const noop = () => {
  /* noop */
};

type BaseRouterProps = {
  location: History["location"];
  services: [number, Interpreter<any, any, any>][];
  mapping: Record<string, any>;
};

export function BaseRouterProvider(props: PropsWithChildren<BaseRouterProps>) {
  const [_, send, service] = useMachine(baseMachine, { devTools: true });
  const bh = useConstant(() => {
    if (typeof window === "undefined") {
      return { location: props.location, listen: noop } as any;
    } else {
      return createBrowserHistory();
    }
  });
  useEffect(() => {
    const unlisten = bh.listen((location, action) => {
      send({ type: "HISTORY_EVT", location, action });
    });
    return () => {
      if (typeof unlisten === "function") {
        unlisten();
      }
    };
  }, [bh, send]);
  const api = useMemo(() => {
    return {
      history: bh,
      send,
      service,
      services: props.services,
      mapping: props.mapping,
    };
  }, [bh, send, service, props.services, props.mapping]);
  return (
    <BaseRouterContext.Provider value={api}>
      {props.children}
    </BaseRouterContext.Provider>
  );
}
