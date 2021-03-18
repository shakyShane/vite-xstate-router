import React, { useEffect, useState } from "react";
import { Seg } from "../../../packages/mfr-router/router";
import { Link, Outlet } from "../../../packages/mfr-router";
console.log("evaled user");

const m1 = import.meta.glob("./*.tsx");

const reachable = {
  ...m1,
};

console.log(reachable);

const segs: Seg[] = [
  { key: "./Login.tsx", as: "login", importer: reachable["./Login.tsx"] },
  { key: "./Orders.tsx", as: "orders", importer: reachable["./Orders.tsx"] },
];

export default function User() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const int = setInterval(() => setCount((x) => x + 1), 1000);
    return () => clearInterval(int);
  }, []);
  return (
    <div>
      <h1>
        User <small>{count}</small>
      </h1>
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
