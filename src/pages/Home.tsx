import React from "react";
import { Link, useResolveData, useRouteData } from "../../packages/mfr-router";

export default function Home() {
  const { data } = useRouteData();
  const resolveData = useResolveData();
  return <div>
    <h1>{data && data.title}</h1>
    <p><code>resolve loading: {String(resolveData.loading)}</code></p>
    <ul>
      <li>
        <Link to={"/contact"}>Contact</Link>
      </li>
      <li>
        <Link to={"/about"}>About</Link>
      </li>
      <li>
        <Link to={"/user"}>User</Link>
      </li>
      <li>
        <Link to={"/user/login"}>User Login</Link>
      </li>
    </ul>
  </div>;
}

export async function dataLoader(ctx, ctx2) {
  return { title: "Homepage is here" };
}
