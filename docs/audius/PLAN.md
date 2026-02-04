# Webamp Audius Fork Plan

**Owner:** CTO
**App name:** `webamp-aud`
**API base:** `https://api.audius.co/v1`

**Summary**
We will fork Webamp into a standalone product that adds an in‑app Audius browser window. The browser uses Audius APIs directly and renders results inside a Winamp‑style window. Users can browse, search, and add tracks or playlists to the Webamp playlist, read‑only and streamable only.

**Goals**
1. Provide a native-feeling Audius browsing experience inside Webamp.
2. Support adding a single track, a playlist, or a user’s tracks via URL input.
3. Populate the playlist with Audius tracks with correct artist, title, duration, and artwork.
4. Maintain Winamp‑style visuals using existing skins and `GenWindow` chrome.
5. Keep this as a standalone fork without upstream contribution requirements.

**Non‑Goals**
1. No Audius write endpoints, uploads, or user authentication for v1.
2. No gated content support in v1.
3. No Electron desktop shell in v1.

**Key Decisions**
1. Audius browser is an in‑app window, not an embedded website.
2. All data is fetched via the Audius REST API with `app_name=webamp-aud`.
3. Read‑only, free/streamable tracks only.
4. Use `GenWindow` for new UI to preserve Winamp style.

**Architecture Overview**
The fork keeps the Webamp audio engine untouched. We add a small Audius data adapter and a new Audius Browser window. UI actions convert Audius tracks into Webamp `Track` objects and enqueue or play them. We will keep a thin adapter boundary so it can be reused elsewhere in the fork if we later add a desktop shell.

**Data Flow**
1. User opens Audius Browser window or uses Add URL.
2. UI calls Audius adapter (fetch trending, search, resolve URL, fetch playlist tracks).
3. Adapter maps Audius Track to Webamp `Track` with `metaData`, `duration`, and `albumArtUrl`.
4. UI dispatches `Actions.loadMediaFiles(tracks, LOAD_STYLE.XXX)`.
5. Webamp plays as normal via HTMLAudioElement with CORS.

**UI Surfaces**
1. Audius Browser window, opened from main menu and playlist UI.
2. Add URL dialog for track, playlist, or user URLs.
3. Playlist auto‑populate from browser selections.

**API Endpoints**
1. `GET /tracks/trending`
2. `GET /tracks/search`
3. `GET /playlists/{playlist_id}/tracks`
4. `GET /users/{id}/tracks`
5. `GET /resolve?url=...`
6. `GET /tracks/{track_id}/stream?no_redirect=true`

**Track Mapping**
1. `Track.url` is the Audius stream URL from `/tracks/{id}/stream?no_redirect=true`.
2. `Track.metaData.artist` from `track.user.name` or `track.user.handle`.
3. `Track.metaData.title` from `track.title`.
4. `Track.metaData.album` set from playlist name when adding from a playlist.
5. `Track.metaData.albumArtUrl` from `track.artwork.480x480` when available.
6. `Track.duration` from `track.duration` (seconds).

**Error Handling**
1. If a track is not streamable, skip and show a non‑blocking toast or status line.
2. If a stream URL request fails, retry once then skip.
3. If no results are found, show empty state in the browser window.

**Milestones**
1. Add Audius adapter with basic fetches and mapping.
2. Add Audius Browser window with Trending and Search.
3. Add URL dialog flow and playlist auto‑populate.
4. Polish UI, error states, and basic QA.

**Risks**
1. Stream URLs may expire; re‑fetch on demand if needed.
2. CORS policy changes on Audius endpoints.
3. API host rotation could affect reliability.

**Open Questions**
1. Do we want to refresh stream URLs on play to avoid expiry?
2. Should the Add URL flow accept non‑Audius URLs or be Audius‑only?
3. Do we want a lightweight toast/status UI or just console/log + alert?
