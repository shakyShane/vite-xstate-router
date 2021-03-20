import React from "react";
import { useResolveData, useRouteData } from "../../../packages/mfr-router";
import { createDebug } from "../../../packages/mfr-router/debug";
import { ResolveDataParams } from "../../../packages/mfr-router/router";
const debug = createDebug("Orders");

export default function Orders() {
  const { data, loading } = useRouteData();
  const resolveData = useResolveData();
  if (import.meta.env.SSR) {
    // console.log("data from Order->", resolveData);
    // console.log("loading data from Order->", data);
  }
  return (
    <div>
      <h2>Your orders</h2>
      {resolveData && (
        <pre><code>{JSON.stringify(resolveData, null, 2)}</code></pre>
      )}
      {loading && <p>data loading......</p>}
      {!loading && data && (
        <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
      )}
    </div>
  );
}

export async function dataLoader(resolveData: ResolveDataParams) {
  await new Promise((res) => setTimeout(res, 500));
  return { name: "data from Orders..." };
}
