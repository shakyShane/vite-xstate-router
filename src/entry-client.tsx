import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BaseRouterProvider } from "../packages/mfr-router";
import { createLocation } from "history";

ReactDOM.hydrate(
  <React.StrictMode>
    <BaseRouterProvider
      location={createLocation(window.location.pathname)}
    >
      <App />
    </BaseRouterProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
