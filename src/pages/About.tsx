import React from "react";
import { Link } from "../../packages/mfr-router";
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/contact"}>Contact</Link>
        </li>
        <li>
          <Link to={"/user"}>User</Link>
        </li>
      </ul>
    </div>
  );
}
