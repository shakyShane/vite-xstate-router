import React, { useState } from "react";
import { Link } from "../../packages/mfr-router";
const modules = import.meta.url;
console.log(import.meta.url);
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
