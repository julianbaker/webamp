# IC Backend Plan (Audius Adapter)

**Owner:** Backend IC
**Goal:** Provide a clean Audius API adapter and track mapping utilities for the UI to consume.

**Scope**
1. Add an Audius client module that wraps fetch calls.
2. Provide mapping from Audius Track objects to Webamp `Track`.
3. Provide helpers for resolving Audius URLs.
4. Provide small caching for stream URLs in session.

**Suggested File Layout**
1. `packages/webamp/js/audius/client.ts`
2. `packages/webamp/js/audius/mappers.ts`
3. `packages/webamp/js/audius/types.ts`
4. `packages/webamp/js/audius/index.ts`

**API Base and Params**
1. Base URL: `https://api.audius.co/v1`.
2. Always include `app_name=webamp-aud`.
3. Use `no_redirect=true` for stream URLs.

**Functions to Implement**
1. `getTrendingTracks(limit, offset)`
2. `searchTracks(query, limit, offset)`
3. `getPlaylistTracks(playlistId)`
4. `getUserTracks(userId)`
5. `resolveAudiusUrl(url)`
6. `getStreamUrl(trackId)`
7. `trackToWebampTrack(track, { album })`

**Mapping Rules**
1. `Track.url` uses `getStreamUrl`.
2. `Track.metaData.artist` from `track.user.name` or `track.user.handle`.
3. `Track.metaData.title` from `track.title`.
4. `Track.metaData.albumArtUrl` from `track.artwork.480x480` or `track.artwork.150x150`.
5. `Track.duration` from `track.duration`.

**Caching**
1. Cache stream URLs in memory for the current session.
2. Cache key should be `trackId`.
3. TTL can be short, for example 5 to 15 minutes.

**Error Handling**
1. Throw a typed error for non‑2xx responses.
2. Return empty arrays for search or trending on failure and surface a UI error.

**Acceptance Criteria**
1. Trending, search, and playlist fetches return mapped Webamp Tracks.
2. Resolving a track URL returns a playable Track.
3. Resolving a playlist URL returns a playable Track list.
4. Stream URL fetch works with `no_redirect=true`.

**Notes**
1. Keep Audius module independent of Redux or UI.
2. Use `fetch` from browser runtime.
