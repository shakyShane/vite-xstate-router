import React from "react";
import { useResolveData, useRouteData } from "../../../packages/mfr-router";
import { createDebug } from "../../../packages/mfr-router/debug";
import { ResolveDataParams } from "../../../packages/mfr-router/router";
const debug = createDebug("Orders");

export default function Orders() {
  const { data, loading } = useRouteData();
  const resolveData = useResolveData();
  if (import.meta.env.SSR) {
    console.log("data from Order->", resolveData);
    console.log("loading data from Order->", data);
  }
  return (
    <div>
      <h2>Your orders</h2>
      {resolveData.loading && <p>resolving...</p>}
      {!resolveData.loading && resolveData.data && (
        <p>{JSON.stringify(resolveData.data, null, 2)}</p>
      )}
      {loading && <p>data loading......</p>}
      {!loading && data && (
        <p>{JSON.stringify(data, null, 2)}</p>
      )}
    </div>
  );
}

export async function dataLoader(resolveData: ResolveDataParams) {
  console.log("SSR data loader begin", resolveData);
  await new Promise((res) => setTimeout(res, 500));
  console.log("SSR data loader end", resolveData);
  return { name: "shane" };
}
