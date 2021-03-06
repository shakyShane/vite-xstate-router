import React, { useEffect, useState } from "react";
import { Seg } from "../../../packages/mfr-router/router";
import {
  Link,
  Outlet,
  useResolveData,
  useRouteData,
} from "../../../packages/mfr-router";

const m1 = import.meta.glob("./*.tsx");

const reachable = {
  ...m1,
};

const segs: Seg[] = [
  { key: "./Login.tsx", as: "login", importer: reachable["./Login.tsx"] },
  { key: "./Orders.tsx", as: "orders", importer: reachable["./Orders.tsx"] },
];

if (import.meta.env.SSR) {
  const m1 = import.meta.globEager("./*.tsx");
  segs.forEach((seg) => {
    const match = m1[seg.key];
    seg.cmp = match;
  });
}

export default function User() {
  const routeData = useRouteData();
  const resolveData = useResolveData();
  return (
    <div>
      <h1>
        User <Counter />
      </h1>
      {routeData.data && (
        <pre><code>{JSON.stringify(routeData.data)}</code></pre>
      )}
      {resolveData && (
        <pre><code>{JSON.stringify(resolveData, null, 2)}</code></pre>
      )}
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/contact"}>Contact</Link>
        </li>
        <li>
          <Link to={"/user/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/user/orders"}>Orders</Link>
        </li>
      </ul>
      <Outlet segs={segs} />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setCount((x) => x + 1), 1000);
    return () => clearInterval(int);
  }, []);
  return <small>{count}</small>;
}

export async function dataLoader(ctx) {
  return { name: "data from User..." };
}
