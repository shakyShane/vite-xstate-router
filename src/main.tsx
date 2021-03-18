import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BaseRouterProvider } from "../packages/mfr-router";
import { createLocation } from "history";
console.log(BaseRouterProvider);

ReactDOM.render(
  <React.StrictMode>
    <BaseRouterProvider
      location={createLocation(window.location.pathname)}
      routers={{}}
      register={() => console.log("register")}
    >
      <App />
    </BaseRouterProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
