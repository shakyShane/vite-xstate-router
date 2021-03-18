import { MatchData, Resolver, ResolverParams, Seg } from "./router";
import matchPath from "./match-path";

export const pageLoader: Resolver = async function pageLoader(input) {
  const { seg, data } = lookup(input);
  if (seg && data) {
    return {
      component: (await seg.importer()).default,
      query: {},
      params: data.params,
    };
  }
  return { component: null, query: {}, params: {} };
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

  let earlyMatch = segs.find((seg) => {
    return seg.as === curr;
  });

  if (earlyMatch) {
    matchingSeg = earlyMatch;
    matchingData = matchPath(location.pathname, {
      path: location.pathname,
    });
  }

  if (!matchingSeg) {
    segs.forEach((seg, i) => {
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
  let nextUrl = "" + matchingSeg.key;
  let matched = segs.find((seg) => seg.key === nextUrl);
  if (!matched) {
    console.log("no match");
    // throw new Error("no match");
  }
  return { seg: matched, data: matchingData };
}
