import debug from "debug";

export function createDebug(name = "") {
    return debug(`router:${name}`);
}