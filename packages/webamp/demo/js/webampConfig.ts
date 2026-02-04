import * as Sentry from "@sentry/browser";
// @ts-ignore
import createMiddleware from "redux-sentry-middleware";
// @ts-ignore
import isButterchurnSupported from "butterchurn/dist/isSupported.min";
import { loggerMiddleware } from "./eventLogger";
import { Action, Options, AppState, WindowLayout } from "../../js/types";

import { getButterchurnOptions } from "./butterchurnOptions";
import availableSkins from "./availableSkins";
import { getTrendingTracks, resolveAudiusUrl } from "../../js/audius";

import { initialState } from "./config";
import screenshotInitialState from "./screenshotInitialState";
import { InjectableDependencies, PrivateOptions } from "../../js/webampLazy";

const NOISY_ACTION_TYPES = new Set([
  "STEP_MARQUEE",
  "UPDATE_TIME_ELAPSED",
  "UPDATE_WINDOW_POSITIONS",
  "SET_VOLUME",
  "SET_BALANCE",
  "SET_BAND_VALUE",
]);

const MIN_MILKDROP_WIDTH = 725;

let lastActionType: string | null = null;

// Filter out consecutive common actions
function filterBreadcrumbActions(action: Action) {
  const noisy =
    lastActionType != null &&
    NOISY_ACTION_TYPES.has(action.type) &&
    NOISY_ACTION_TYPES.has(lastActionType);
  lastActionType = action.type;
  return !noisy;
}

const sentryMiddleware = createMiddleware(Sentry, {
  filterBreadcrumbActions,
  stateTransformer: getDebugData,
});

export async function getWebampConfig(
  screenshot: boolean,
  skinUrl: string | null
): Promise<Options & PrivateOptions & InjectableDependencies> {
  let __butterchurnOptions;
  let windowLayout: WindowLayout | undefined;
  if (isButterchurnSupported()) {
    const startWithMilkdropHidden = skinUrl != null || screenshot;

    __butterchurnOptions = getButterchurnOptions(startWithMilkdropHidden);

    if (
      startWithMilkdropHidden ||
      document.body.clientWidth < MIN_MILKDROP_WIDTH
    ) {
      windowLayout = {
        main: { position: { left: 0, top: 0 } },
        equalizer: { position: { left: 0, top: 116 } },
        playlist: {
          position: { left: 0, top: 232 },
          size: { extraHeight: 0, extraWidth: 0 },
          closed: false,
        },
        milkdrop: {
          position: { left: 0, top: 348 },
          size: { extraHeight: 0, extraWidth: 0 },
        },
      };
    } else {
      windowLayout = {
        main: { position: { left: 0, top: 0 } },
        equalizer: { position: { left: 0, top: 116 } },
        playlist: {
          position: { left: 0, top: 232 },
          size: { extraHeight: 4, extraWidth: 0 },
          closed: false,
        },
        milkdrop: {
          position: { left: 275, top: 0 },
          size: { extraHeight: 12, extraWidth: 7 },
        },
      };
    }
  }

  const initialSkin = !skinUrl ? undefined : { url: skinUrl };

  const initialTracks = screenshot
    ? undefined
    : await getTrendingTracks(100, 0);

  return {
    initialSkin,
    initialTracks,
    availableSkins,
    windowLayout,
    filePickers: [],
    enableHotkeys: true,
    enableMediaSession: true,
    handleTrackDropEvent: (e) => {
      const trackJson = e.dataTransfer.getData("text/json");
      if (trackJson == null) {
        return null;
      }
      try {
        const track = JSON.parse(trackJson);
        return [track];
      } catch (_err) {
        return null;
      }
    },
    handleAddUrlEvent: async () => {
      const url = window.prompt(
        "Enter an Audius track, playlist, or user URL."
      );
      if (!url) {
        return null;
      }
      try {
        const resolved = await resolveAudiusUrl(url.trim());
        if (resolved.type === "track") {
          return [resolved.track];
        }
        if (resolved.tracks.length === 0) {
          alert("No streamable tracks found at that URL.");
          return null;
        }
        return resolved.tracks;
      } catch (error) {
        console.error("Failed to resolve Audius URL", error);
        alert("Could not resolve Audius URL.");
        return null;
      }
    },
    requireJSZip: () =>
      // @ts-ignore
      import(/* webpackChunkName: "jszip" */ "jszip/dist/jszip"),
    requireMusicMetadata: () =>
      // @ts-ignore
      import(/* webpackChunkName: "music-metadata" */ "music-metadata"),
    __initialState: screenshot ? screenshotInitialState : initialState,
    __butterchurnOptions,
    __customMiddlewares: [sentryMiddleware, loggerMiddleware],
  };
}

function getDebugData(state: AppState) {
  return {
    ...state,
    display: {
      ...state.display,
      skinGenLetterWidths: "[[REDACTED]]",
      skinImages: "[[REDACTED]]",
      skinCursors: "[[REDACTED]]",
      skinRegion: "[[REDACTED]]",
    },
  };
}
