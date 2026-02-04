import { CSSProperties, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import GenWindow from "../GenWindow";
import WinampButton from "../WinampButton";
import { LOAD_STYLE, WINDOWS } from "../../constants";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { useActionCreator, useTypedSelector } from "../../hooks";
import { Track } from "../../types";
import { getTrendingTracks, searchTracks } from "../../../demo/js/audius";

type ViewMode = "trending" | "search";

type TrackListState = {
  status: "idle" | "loading" | "ready";
  tracks: Track[];
  query?: string;
};

const RESULT_LIMIT = 20;

const formatDuration = (duration?: number): string => {
  if (typeof duration !== "number" || Number.isNaN(duration)) {
    return "--:--";
  }
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getTrackTitle = (track: Track): string =>
  track.metaData?.title || track.defaultName || "Unknown Title";

const getTrackArtist = (track: Track): string =>
  track.metaData?.artist || "Unknown Artist";

function AudiusWindow() {
  const [view, setView] = useState<ViewMode>("trending");
  const [trendingState, setTrendingState] = useState<TrackListState>({
    status: "loading",
    tracks: [],
  });
  const [searchState, setSearchState] = useState<TrackListState>({
    status: "idle",
    tracks: [],
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const searchRequestId = useRef(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const loadMediaFiles = useActionCreator(Actions.loadMediaFiles);
  const trackCount = useTypedSelector(Selectors.getTrackCount);
  const skinPlaylistStyle = useTypedSelector(Selectors.getSkinPlaylistStyle);
  const skinGenExColors = useTypedSelector(
    (state) => state.display.skinGenExColors
  );

  useEffect(() => {
    let cancelled = false;
    setTrendingState({ status: "loading", tracks: [] });
    getTrendingTracks(RESULT_LIMIT, 0)
      .then((tracks) => {
        if (cancelled) {
          return;
        }
        setTrendingState({ status: "ready", tracks });
      })
      .catch((_error) => {
        if (cancelled) {
          return;
        }
        setTrendingState({ status: "ready", tracks: [] });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (view === "search") {
      searchInputRef.current?.focus();
    }
  }, [view]);

  const activeState = view === "trending" ? trendingState : searchState;

  useEffect(() => {
    const activeTracks =
      view === "trending" ? trendingState.tracks : searchState.tracks;
    if (activeTracks.length === 0) {
      setSelectedIndex(null);
      return;
    }
    setSelectedIndex((prev) => {
      if (prev == null || prev >= activeTracks.length) {
        return 0;
      }
      return prev;
    });
  }, [view, trendingState.tracks, searchState.tracks]);

  const resolveSelectedTrack = (fallback?: Track): Track | null => {
    if (fallback) {
      return fallback;
    }
    if (!activeState.tracks.length) {
      return null;
    }
    const index = selectedIndex ?? 0;
    return activeState.tracks[Math.min(index, activeState.tracks.length - 1)];
  };

  const handlePlayNow = (track?: Track) => {
    const selected = resolveSelectedTrack(track);
    if (!selected) {
      return;
    }
    loadMediaFiles([selected], LOAD_STYLE.PLAY);
  };

  const handleEnqueue = (track?: Track) => {
    const selected = resolveSelectedTrack(track);
    if (!selected) {
      return;
    }
    loadMediaFiles([selected], LOAD_STYLE.NONE, trackCount);
  };

  const handleAddAll = () => {
    if (!activeState.tracks.length) {
      return;
    }
    loadMediaFiles(activeState.tracks, LOAD_STYLE.NONE, trackCount);
  };

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      setSearchState({ status: "idle", tracks: [] });
      return;
    }
    const requestId = ++searchRequestId.current;
    setSearchState({ status: "loading", tracks: [], query });
    const tracks = await searchTracks(query, RESULT_LIMIT, 0);
    if (requestId !== searchRequestId.current) {
      return;
    }
    setSearchState({ status: "ready", tracks, query });
  };

  const canAct = activeState.tracks.length > 0;
  const canActSelected = canAct && selectedIndex != null;

  const statusText = (() => {
    if (activeState.status === "loading") {
      return "Loading...";
    }
    if (view === "search" && activeState.status === "idle") {
      return "Enter a search term.";
    }
    if (!activeState.tracks.length) {
      return view === "search" ? "No results." : "No trending tracks.";
    }
    if (view === "search") {
      return `${activeState.tracks.length} results`;
    }
    return `${activeState.tracks.length} trending tracks`;
  })();

  return (
    <GenWindow title="Audius Browser" windowId={WINDOWS.AUDIUS}>
      {({ width, height }) => (
        <div
          className="audius-window"
          style={
            {
              width,
              height,
              "--audius-text": skinPlaylistStyle.normal,
              "--audius-bg": skinPlaylistStyle.normalbg,
              "--audius-selected-bg": skinPlaylistStyle.selectedbg,
              "--audius-selected-text": skinGenExColors.listTextSelected,
              "--audius-font": `${skinPlaylistStyle.font}, Arial, sans-serif`,
              "--audius-border": skinGenExColors.divider,
              "--audius-panel": skinGenExColors.windowBackground,
              "--audius-muted": skinPlaylistStyle.current,
              "--audius-input-bg": skinPlaylistStyle.normalbg,
            } as CSSProperties
          }
        >
          <div className="audius-toolbar">
            <div className="audius-tabs">
              <WinampButton
                className={classnames("audius-tab", {
                  active: view === "trending",
                })}
                onClick={() => setView("trending")}
              >
                Trending
              </WinampButton>
              <WinampButton
                className={classnames("audius-tab", {
                  active: view === "search",
                })}
                onClick={() => setView("search")}
              >
                Search
              </WinampButton>
            </div>
            {view === "search" && (
              <div className="audius-search">
                <input
                  ref={searchInputRef}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Search tracks"
                />
                <WinampButton
                  className="audius-button audius-search-button"
                  onClick={handleSearch}
                >
                  Go
                </WinampButton>
              </div>
            )}
          </div>
          <div className="audius-results">
            <div className="audius-results-scroll">
              {activeState.status === "loading" && (
                <div className="audius-empty">Loading...</div>
              )}
              {activeState.status !== "loading" &&
                activeState.tracks.length === 0 && (
                  <div className="audius-empty">
                    {view === "search"
                      ? activeState.status === "idle"
                        ? "Enter a search term."
                        : "No results."
                      : "No trending tracks."}
                  </div>
                )}
              {activeState.tracks.map((track, index) => {
                const title = getTrackTitle(track);
                const artist = getTrackArtist(track);
                const key =
                  "url" in track ? track.url.toString() : `${title}-${index}`;
                return (
                  <div
                    key={key}
                    className={classnames("audius-track", {
                      selected: index === selectedIndex,
                    })}
                    onClick={() => setSelectedIndex(index)}
                    onDoubleClick={() => handlePlayNow(track)}
                  >
                    <div className="audius-track-index">{index + 1}.</div>
                    <div className="audius-track-title">
                      <span className="audius-track-primary">{title}</span>
                      <span className="audius-track-artist">
                        {artist ? ` - ${artist}` : ""}
                      </span>
                    </div>
                    <div className="audius-track-duration">
                      {formatDuration(track.duration)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="audius-actions">
            <WinampButton
              className={classnames("audius-button", {
                disabled: !canActSelected,
              })}
              onClick={canActSelected ? () => handlePlayNow() : undefined}
            >
              Play Now
            </WinampButton>
            <WinampButton
              className={classnames("audius-button", {
                disabled: !canActSelected,
              })}
              onClick={canActSelected ? () => handleEnqueue() : undefined}
            >
              Enqueue
            </WinampButton>
            <WinampButton
              className={classnames("audius-button", {
                disabled: !canAct,
              })}
              onClick={canAct ? handleAddAll : undefined}
            >
              Add All
            </WinampButton>
            <div className="audius-status">{statusText}</div>
          </div>
        </div>
      )}
    </GenWindow>
  );
}

export default AudiusWindow;
