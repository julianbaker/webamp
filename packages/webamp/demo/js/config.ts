import { PartialState } from "../../js/types";

interface Config {
  skinUrl?: string;
  disableMarquee?: boolean;
  initialState?: PartialState;
}

const { hash } = window.location;
let config: Config = {};
if (hash) {
  try {
    config = JSON.parse(decodeURIComponent(hash).slice(1));
  } catch (_e) {
    console.error("Failed to decode config from hash: ", hash);
  }
}

export const SHOW_DESKTOP_ICONS = true;

if ("URLSearchParams" in window) {
  // const params = new URLSearchParams(location.search);
  // SHOW_DESKTOP_ICONS = Boolean(params.get("icons"));
}

export const skinUrl = config.skinUrl ?? null;

export const disableMarquee = config.disableMarquee || false;
export const initialState = config.initialState || undefined;
