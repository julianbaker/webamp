import { CSSProperties, useEffect, useRef, useState, useCallback } from "react";
import classnames from "classnames";
import { LOAD_STYLE } from "../../constants";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { useActionCreator, useTypedSelector } from "../../hooks";
import { Track } from "../../types";
import { getTrendingTracks, searchTracks } from "../../audius";
import WinampButton from "../WinampButton";

type ViewMode = "trending" | "search";

type TrackListState = {
  status: "idle" | "loading" | "ready";
  tracks: Track[];
  query?: string;
};

const TRENDING_LIMIT = 100;
const SEARCH_LIMIT = 20;

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

function AudiusPlaylist() {
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
  const [playlistKey, setPlaylistKey] = useState<string | null>(null);
  const [pendingPlay, setPendingPlay] = useState<{
    index: number;
    total: number;
  } | null>(null);

  const searchRequestId = useRef(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const loadMediaFiles = useActionCreator(Actions.loadMediaFiles);
  const removeAllTracks = useActionCreator(Actions.removeAllTracks);
  const playTrackNow = useActionCreator(Actions.playTrackNow);
  const trackOrder = useTypedSelector(Selectors.getTrackOrder);
  const skinPlaylistStyle = useTypedSelector(Selectors.getSkinPlaylistStyle);
  const skinGenExColors = useTypedSelector(
    (state) => state.display.skinGenExColors
  );
  const resolvedGenExColors =
    skinGenExColors ?? {
      listTextSelected: skinPlaylistStyle.current,
      divider: "#2c2c2c",
      windowBackground: "#111111",
    };

  useEffect(() => {
    let cancelled = false;
    setTrendingState((prev) => ({
      status: "loading",
      tracks: prev.tracks,
    }));
    getTrendingTracks(TRENDING_LIMIT, 0)
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

  const loadPlaylist = useCallback(
    (tracks: Track[], key: string) => {
      if (!tracks.length || playlistKey === key) {
        return;
      }
      removeAllTracks();
      loadMediaFiles(tracks, LOAD_STYLE.NONE, 0);
      setPlaylistKey(key);
    },
    [loadMediaFiles, playlistKey, removeAllTracks]
  );

  useEffect(() => {
    if (view === "trending" && trendingState.status === "ready") {
      loadPlaylist(trendingState.tracks, "trending");
    }
  }, [loadPlaylist, trendingState.status, trendingState.tracks, view]);

  useEffect(() => {
    if (view !== "search" || searchState.status !== "ready") {
      return;
    }
    if (!searchState.query) {
      return;
    }
    loadPlaylist(searchState.tracks, `search:${searchState.query}`);
  }, [loadPlaylist, searchState.query, searchState.status, searchState.tracks, view]);

  useEffect(() => {
    if (!pendingPlay) {
      return;
    }
    if (trackOrder.length < pendingPlay.total) {
      return;
    }
    const trackId = trackOrder[pendingPlay.index];
    if (trackId == null) {
      return;
    }
    playTrackNow(trackId);
    setPendingPlay(null);
  }, [pendingPlay, playTrackNow, trackOrder]);

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      setSearchState({ status: "idle", tracks: [] });
      return;
    }
    const requestId = ++searchRequestId.current;
    setSearchState((prev) => ({
      status: "loading",
      tracks: prev.query === query ? prev.tracks : [],
      query,
    }));
    const tracks = await searchTracks(query, SEARCH_LIMIT, 0);
    if (requestId !== searchRequestId.current) {
      return;
    }
    setSearchState({ status: "ready", tracks, query });
  };

  const handlePlayNow = (index?: number) => {
    if (!activeState.tracks.length) {
      return;
    }
    const selected =
      index ?? selectedIndex ?? Math.max(0, activeState.tracks.length - 1);
    const key =
      view === "trending"
        ? "trending"
        : `search:${activeState.query ?? searchInput}`;
    loadPlaylist(activeState.tracks, key);
    setPendingPlay({ index: selected, total: activeState.tracks.length });
  };

  return (
    <div
      className="audius-window"
      style={
        {
          "--audius-text": skinPlaylistStyle.normal,
          "--audius-bg": skinPlaylistStyle.normalbg,
          "--audius-selected-bg": skinPlaylistStyle.selectedbg,
          "--audius-selected-text": resolvedGenExColors.listTextSelected,
          "--audius-font": `${skinPlaylistStyle.font}, Arial, sans-serif`,
          "--audius-border": resolvedGenExColors.divider,
          "--audius-panel": resolvedGenExColors.windowBackground,
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
          {activeState.status === "loading" &&
            activeState.tracks.length === 0 && (
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
                onDoubleClick={() => handlePlayNow(index)}
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
    </div>
  );
}

export default AudiusPlaylist;
