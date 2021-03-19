import React from "react";
import {Link, useRouteData} from "../../packages/mfr-router";

export default function Home() {
  const {data} = useRouteData();
  return <div>
    <h1>{data && data.title}</h1>
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

export async function dataLoader() {
  console.log('GETTING DATAZ');
  return {title: "Homepage is here"}
}