import React, { useState } from "react";
import { Link } from "../../packages/mfr-router";
console.log("evaled contact");
export default function Contact() {
  return (
    <div>
      <h1>Contact</h1>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/about"}>About</Link>
        </li>
        <li>
          <Link to={"/user"}>User</Link>
        </li>
      </ul>
    </div>
  );
}
