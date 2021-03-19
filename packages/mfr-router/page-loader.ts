import { MatchData, Resolver, ResolverParams, Seg } from "./router";
import matchPath from "./match-path";

export const pageLoader: Resolver = async function pageLoader(input) {
  const { seg, data } = lookup(input);
  if (seg && data) {
    const mod = await seg.importer();
    return {
      dataLoader: mod.dataLoader,
      component: mod.default,
      query: {},
      params: data.params,
    };
  }
  return { component: null, dataLoader: null, query: {}, params: {} };
};

export function lookup(
  params: ResolverParams,
): { seg: Seg | undefined; data: MatchData | undefined } {
  const {
    location,
    depth,
    parents,
    segs,
  } = params;
  const psegs = ["/", ...location.pathname.slice(1).split("/")].filter(
    Boolean,
  );

  const curr = location.pathname === "/" ? "/" : psegs[depth + 1];
  let matchingSeg: any;
  let matchingData: MatchData | null = null;

  const earlyMatch = segs.find((seg) => {
    return seg.as === curr;
  });

  if (earlyMatch) {
    matchingSeg = earlyMatch;
    matchingData = matchPath(location.pathname, {
      path: location.pathname,
    });
  }

  if (!matchingSeg) {
    segs.forEach((seg) => {
      if (matchingSeg) return;

      if (seg.as === "/" && location.pathname === "/") {
        matchingSeg = seg;
        matchingData = matchPath(location.pathname, {
          path: "/",
          exact: true,
        });
      }
      const asPath = "/" + parents.concat(seg.as).join("/");
      const match = matchPath(location.pathname, {
        path: asPath,
        exact: true,
      });
      if (match) {
        matchingSeg = seg;
        matchingData = match;
      }
    });
  }

  if (!matchingSeg || !matchingData) {
    return { data: undefined, seg: undefined };
  }
  const nextUrl = "" + matchingSeg.key;
  const matched = segs.find((seg) => seg.key === nextUrl);
  if (!matched) {
    console.log("no match");
    // throw new Error("no match");
  }
  return { seg: matched, data: matchingData };
}
