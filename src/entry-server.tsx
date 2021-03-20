import ReactDOMServer from "react-dom/server";
import App from "./App";
import { createLocation } from "history";
import { BaseRouterProvider } from "../packages/mfr-router";
import React from "react";
import { Interpreter } from "xstate";

export async function render(url, _context) {
  const services: [number, Interpreter<any>][] = [];
  const mapping = {};
  let res = "";
  async function run() {
    res = ReactDOMServer.renderToString(
      <BaseRouterProvider
        location={createLocation(url)}
        mapping={mapping}
        services={services}
      >
        <App />
      </BaseRouterProvider>,
    );
    if (services.length > 0) {
      const p = new Promise((res) => {
        console.log("services.length = %o", services.length);
        const next = services.shift();
        if (!next) {
          console.log("could not access");
          res({});
          return;
        }
        const [depth, i] = next;
        // console.log('sub');
        i.start().onTransition((x) => {
          switch (x.event.type) {
            case "xstate.init": {
              /* noop */
              break;
            }
            case "NOTIFY_RESOLVED": {
              console.log("~~NOTIFY_RESOLVED", x.event);
              mapping[String(depth)] = { ...x.context };
              res({});
              break;
            }
            default:
              console.log("+++", x.event);
          }
        });
      });
      await p;
      console.log("done waitin");
      await run();
    }
  }
  await run();
  return res;
}
