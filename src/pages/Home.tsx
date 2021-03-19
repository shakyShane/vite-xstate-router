import React from "react";
import { Link } from "../../packages/mfr-router";

export default function Home() {
  return <div>
    <h1>Home</h1>
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
