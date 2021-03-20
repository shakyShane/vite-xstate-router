import React, {useEffect, useState} from "react";
import {useResolveData, useRouteData} from "../../../packages/mfr-router";
import {createDebug} from "../../../packages/mfr-router/debug";

const debug = createDebug("Login");

export default function Login() {
  const {data} = useRouteData();
  const resolve = useResolveData();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div>
      <h2>{data && data.title || "Please wait..."}</h2>
      {ready ? (
        <div>
          <p>Loading: {String(resolve.loading)}</p>
        </div>
      ) : <p>please wait...</p> }
    </div>
  );
}

export async function dataLoader() {
  return { title: "Log into your account"}
}
