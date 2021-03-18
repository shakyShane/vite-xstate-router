import ReactDOMServer from "react-dom/server";
import App from "./App";
import { createLocation } from "history";
import { BaseRouterProvider } from "../packages/mfr-router";
import React from "react";

export async function render(url, context) {
  return ReactDOMServer.renderToString(
    <BaseRouterProvider
      location={createLocation(url)}
    >
      <App />
    </BaseRouterProvider>,
  );
}
