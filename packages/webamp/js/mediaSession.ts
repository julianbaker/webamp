import type WebampLazy from "./webampLazy";
import * as Selectors from "./selectors";

export default function enableMediaSession(webamp: WebampLazy) {
  if ("mediaSession" in navigator) {
    const setActionHandler = (
      action: string,
      handler: ((details?: { seekOffset?: number }) => void) | null
    ) => {
      try {
        // @ts-ignore TypeScript does not know about the Media Session API.
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (_error) {
        // Some browsers throw for unsupported actions. Ignore and continue.
      }
    };

    const updatePlaybackState = () => {
      const status = Selectors.getPlayerMediaStatus(webamp.store.getState());
      const nextState =
        status === "PLAYING"
          ? "playing"
          : status === "PAUSED"
          ? "paused"
          : "none";
      if (navigator.mediaSession.playbackState !== nextState) {
        navigator.mediaSession.playbackState = nextState;
      }
    };

    /* global MediaMetadata */
    webamp.onTrackDidChange((track) => {
      if (track == null) {
        navigator.mediaSession.metadata = null;
        return;
      }
      const {
        metaData: { title, artist, album, albumArtUrl },
      } = track;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title ?? undefined,
        artist: artist ?? undefined,
        album: album ?? undefined,
        artwork: albumArtUrl
          ? [
              {
                src: albumArtUrl,
              },
            ]
          : [],
      });
    });
    updatePlaybackState();
    webamp.store.subscribe(updatePlaybackState);

    setActionHandler("play", () => {
      webamp.play();
    });
    setActionHandler("pause", () => {
      webamp.pause();
    });
    setActionHandler("stop", () => {
      webamp.stop();
    });
    setActionHandler("seekbackward", (details) => {
      const offset = details?.seekOffset ?? 10;
      webamp.seekBackward(offset);
    });
    setActionHandler("seekforward", (details) => {
      const offset = details?.seekOffset ?? 10;
      webamp.seekForward(offset);
    });
    setActionHandler("previoustrack", () => {
      webamp.previousTrack();
    });
    setActionHandler("nexttrack", () => {
      webamp.nextTrack();
    });
  }
}
