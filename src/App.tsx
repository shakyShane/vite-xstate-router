import React from "react";
import "./App.css";
import { Outlet } from "../packages/mfr-router";
import { Seg } from "../packages/mfr-router/router";

const m1 = import.meta.glob("./pages/*.tsx");
const m2 = import.meta.glob("./pages/user/index.tsx");

const reachable = {
  ...m1,
  ...m2,
};

const segs: Seg[] = [
  { key: "./pages/Home.tsx", as: "/", importer: reachable["./pages/Home.tsx"] },
  {
    key: "./pages/Contact.tsx",
    as: "contact",
    importer: reachable["./pages/Contact.tsx"],
  },
  {
    key: "./pages/About.tsx",
    as: "about",
    importer: reachable["./pages/About.tsx"],
  },
  {
    key: "./pages/user/index.tsx",
    as: "user",
    importer: reachable["./pages/user/index.tsx"],
  },
];

if (import.meta.env.SSR) {
  const m1 = import.meta.globEager("./pages/*.tsx");
  const m2 = import.meta.globEager("./pages/user/index.tsx");
  const reachable = {
    ...m1,
    ...m2,
  };
  segs.forEach((seg) => {
    const match = reachable[seg.key];
    seg.cmp = match;
  });
}

function App() {
  return (
    <div className="App">
      <p>HEADER</p>
      <Outlet segs={segs} />
    </div>
  );
}

export default App;
