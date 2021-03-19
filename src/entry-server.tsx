import ReactDOMServer from "react-dom/server";
import App from "./App";
import { createLocation } from "history";
import { BaseRouterProvider } from "../packages/mfr-router";
import React from "react";
import {Interpreter} from "xstate";

export async function render(url, _context) {
  const services: Interpreter<any>[] = [];
  const mapping = {};
  let depth = 0;
  let res = '';
  async function run() {
    if (depth === 2) {
      return;
    }
    res = ReactDOMServer.renderToString(
      <BaseRouterProvider
        location={createLocation(url)}
        services={services}
        mapping={mapping}
      >
        <App />
      </BaseRouterProvider>,
    );
    if (services.length > 0) {
      const p = new Promise((res) => {
        console.log("services.length = %o", services.length);
        const i = services.shift();
        if (!i) {
          console.log("could not access");
          res({});
          return;
        }
        // console.log('sub');
        i.start().onTransition(x => {
          switch (x.event.type) {
            case "xstate.init": {
              /* noop */
              break;
            }
            case "NOTIFY_RESOLVED": {
              console.log("~~NOTIFY_RESOLVED", x.event)
              mapping[x.context.location.pathname] = {...x.context};
              res({});
              break;
            }
            default: console.log("+++", x.event)
          }
        })
      });
      depth += 1;
      await p;
      await run();
    }
  }
  await run();
  return res;
}
