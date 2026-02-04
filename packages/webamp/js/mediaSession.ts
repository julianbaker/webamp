import type WebampLazy from "./webampLazy";
import * as Selectors from "./selectors";

export default function enableMediaSession(webamp: WebampLazy) {
  if ("mediaSession" in navigator) {
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

    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("play", () => {
      webamp.play();
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("pause", () => {
      webamp.pause();
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("stop", () => {
      webamp.stop();
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      webamp.seekBackward(10);
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("seekforward", () => {
      webamp.seekForward(10);
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      webamp.previousTrack();
    });
    // @ts-ignore TypeScript does not know about the Media Session API: https://github.com/Microsoft/TypeScript/issues/19473
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      webamp.nextTrack();
    });
  }
}
