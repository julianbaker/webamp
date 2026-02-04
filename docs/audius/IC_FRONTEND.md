# IC Frontend Plan (Audius Browser UI)

**Owner:** Frontend IC
**Goal:** Build an in‑app Audius Browser window and wire it into the existing Winamp UI.

**Scope**
1. Add an Audius Browser window using `GenWindow`.
2. Add Trending and Search views with result lists.
3. Allow Play Now, Enqueue, and Add All actions.
4. Add an Add URL dialog flow.
5. Wire entry points from existing UI controls and menus.

**Suggested File Layout**
1. `packages/webamp/js/components/AudiusWindow/index.tsx`
2. `packages/webamp/js/components/AudiusWindow/AudiusWindow.css`
3. `packages/webamp/js/components/AudiusWindow/hooks.ts` if needed
4. `packages/webamp/css/audius-window.css` if you prefer global CSS

**Window Integration Tasks**
1. Add a new `WINDOWS.AUDIUS` entry in `packages/webamp/js/constants.ts`.
2. Add a new default window entry in `packages/webamp/js/reducers/windows.ts`.
3. Add the window rendering in `packages/webamp/js/components/App.tsx` where windows are created.
4. Add a menu entry in `packages/webamp/js/components/MainWindow/MainContextMenu.tsx` to open the Audius window.

**UI Wiring Tasks**
1. Repurpose Playlist “File Info” button in `packages/webamp/js/components/PlaylistWindow/MiscMenu.tsx` to open Audius window.
2. Use `handleAddUrlEvent` to open an Audius URL dialog from the Add URL button.
3. Dispatch `Actions.loadMediaFiles(tracks, LOAD_STYLE.XXX)` for enqueue or play.

**Browser UI Behavior**
1. Default view shows Trending tracks.
2. Search view with input and submit button.
3. Selecting a track highlights it.
4. Buttons: Play Now, Enqueue, Add All.
5. Playlist or user results allow “Add All” to populate playlist.

**Add URL Dialog**
1. Accept Audius track, playlist, or user URLs.
2. Resolve via adapter and enqueue results.
3. Show a short error message if resolve fails.

**Acceptance Criteria**
1. Audius window opens from menu and playlist UI.
2. Trending view renders and adds tracks to playlist.
3. Search works and results can be queued.
4. Add URL resolves track or playlist and adds to playlist.

**Notes**
1. Keep UI stateless beyond local component state.
2. Avoid changing the audio engine.
