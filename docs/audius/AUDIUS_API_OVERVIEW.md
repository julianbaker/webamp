# Audius API Endpoint Overview

This document is derived from the local Audius swagger schema located at `.../Audius API Docs/swagger/swagger.json`.
It lists all endpoints grouped by tag, with method, path, summary, and parameters.

**Base URL:** `https://api.audius.co/v1` (the swagger uses a placeholder basePath `AUDIUS_API_HOST/v1`)

**Common Query Param:** Many endpoints accept `app_name` to identify your application.

## challenges

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/challenges/undisbursed` | Get all undisbursed challenges | offset (query), limit (query), user_id (query), completed_blocknumber (query), challenge_id (query), app_name (query) |

## comments

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/comments/unclaimed_id` | Gets an unclaimed blockchain comment ID | app_name (query) |
| GET | `/comments/{comment_id}/replies` | Gets replies to a parent comment | comment_id (path, req), offset (query), limit (query), user_id (query), app_name (query) |

## dashboard_wallet_users

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/dashboard_wallet_users` | Gets Audius user profiles connected to given dashboard wallet addresses | wallets (query, req), app_name (query) |

## developer_apps

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/developer_apps/{address}` | Gets developer app matching given address (API key) | address (path, req), app_name (query) |

## events

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/events` | Get a list of events by ID | user_id (query), id (query), event_type (query), app_name (query) |
| GET | `/events/all` | Get all events | offset (query), limit (query), user_id (query), sort_method (query), event_type (query), app_name (query) |
| GET | `/events/entity` | Get events for a specific entity | offset (query), limit (query), user_id (query), entity_id (query, req), entity_type (query), filter_deleted (query), app_name (query) |
| GET | `/events/unclaimed_id` | Gets an unclaimed blockchain event ID | app_name (query) |

## explore

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/explore/best-selling` | Get best selling tracks and/or albums | offset (query), limit (query), user_id (query), type (query), app_name (query) |

## playlists

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/playlists` | Gets a list of playlists by ID | user_id (query), id (query), app_name (query) |
| GET | `/playlists/by_permalink/{handle}/{slug}` | Get a playlist by handle and slug | handle (path, req), slug (path, req), user_id (query), app_name (query) |
| GET | `/playlists/search` | Search for a playlist | offset (query), limit (query), query (query), genre (query), sort_method (query), mood (query), includePurchaseable (query), has_downloads (query), app_name (query) |
| GET | `/playlists/trending` | Gets trending playlists for a time period | offset (query), limit (query), time (query), app_name (query) |
| GET | `/playlists/{playlist_id}` | Get a playlist by ID | playlist_id (path, req), user_id (query), app_name (query) |
| GET | `/playlists/{playlist_id}/access-info` | Gets the information necessary to access the playlist and what access the given user has. | playlist_id (path, req), user_id (query), app_name (query) |
| GET | `/playlists/{playlist_id}/tracks` | Fetch tracks within a playlist. | playlist_id (path, req), app_name (query) |

## resolve

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/resolve` | Resolves and redirects a provided Audius app URL to the API resource URL it represents | url (query, req), app_name (query) |

## tips

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/tips` | Gets the most recent tips on the network | offset (query), limit (query), user_id (query), receiver_min_followers (query), receiver_is_verified (query), current_user_follows (query), unique_by (query), app_name (query) |

## tracks

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/tracks` | Gets a list of tracks using their IDs or permalinks | permalink (query), id (query), app_name (query) |
| GET | `/tracks/inspect` | Inspects the details of the files for multiple tracks | id (query, req), original (query), app_name (query) |
| GET | `/tracks/recent-premium` | Gets the most recently listed premium tracks | offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/tracks/search` | Search for a track or tracks | offset (query), limit (query), query (query), genre (query), sort_method (query), mood (query), only_downloadable (query), includePurchaseable (query), is_purchaseable (query), has_downloads (query), key (query), bpm_min (query), bpm_max (query), app_name (query) |
| GET | `/tracks/trending` | Gets the top 100 trending (most popular) tracks on Audius | offset (query), limit (query), genre (query), time (query), app_name (query) |
| GET | `/tracks/trending/underground` | Gets the top 100 trending underground tracks on Audius | offset (query), limit (query), app_name (query) |
| GET | `/tracks/{track_id}` | Gets a track by ID | track_id (path, req), app_name (query) |
| GET | `/tracks/{track_id}/access-info` | Gets the information necessary to access the track and what access the given user has. | track_id (path, req), user_id (query), app_name (query) |
| GET | `/tracks/{track_id}/comment_count` | Get the comment count for a track | track_id (path, req), user_id (query), app_name (query) |
| GET | `/tracks/{track_id}/comment_notification_setting` | Get the comment notification setting for a track | track_id (path, req), user_id (query), app_name (query) |
| GET | `/tracks/{track_id}/comments` | Get a list of comments for a track | track_id (path, req), offset (query), limit (query), user_id (query), sort_method (query), app_name (query) |
| GET | `/tracks/{track_id}/download` | Download the original or MP3 file of a track | track_id (path, req), user_id (query), user_signature (query), user_data (query), nft_access_signature (query), original (query), filename (query), app_name (query) |
| GET | `/tracks/{track_id}/inspect` | Inspects the details of the file for a track | track_id (path, req), original (query), app_name (query) |
| GET | `/tracks/{track_id}/stems` | Get the remixable stems of a track | track_id (path, req), app_name (query) |
| GET | `/tracks/{track_id}/stream` | Get the streamable MP3 file of a track | track_id (path, req), user_id (query), preview (query), user_signature (query), user_data (query), nft_access_signature (query), skip_play_count (query), api_key (query), skip_check (query), no_redirect (query), app_name (query) |
| GET | `/tracks/{track_id}/top_listeners` | Get the users that have listened to a track the most | track_id (path, req), offset (query), limit (query), user_id (query), app_name (query) |

## users

| Method | Path | Summary | Parameters |
| --- | --- | --- | --- |
| GET | `/users` | Gets a list of users by ID | user_id (query), id (query), app_name (query) |
| GET | `/users/handle/{handle}` | Gets a single user by their handle | handle (path, req), user_id (query), app_name (query) |
| GET | `/users/handle/{handle}/tracks/ai_attributed` | Gets the AI generated tracks attributed to a user using the user's handle | handle (path, req), offset (query), limit (query), user_id (query), sort (query), query (query), sort_method (query), sort_direction (query), filter_tracks (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/id` | Gets a User ID from an associated wallet address | associated_wallet (query, req), app_name (query) |
| GET | `/users/search` | Search for users that match the given query | offset (query), limit (query), query (query), genre (query), sort_method (query), is_verified (query), app_name (query) |
| GET | `/users/verify_token` | Verify if the given jwt ID token was signed by the subject (user) in the payload | token (query, req), app_name (query) |
| GET | `/users/{id}` | Gets a single user by their user ID | id (path, req), app_name (query) |
| GET | `/users/{id}/albums` | Gets the albums created by a user using their user ID | id (path, req), offset (query), limit (query), user_id (query), sort_method (query), query (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/authorized_apps` | Get the apps that user has authorized to write to their account | id (path, req), app_name (query) |
| GET | `/users/{id}/challenges` | Gets all challenges for the given user | id (path, req), show_historical (query), app_name (query) |
| GET | `/users/{id}/collectibles` | Get the User's indexed collectibles data | id (path, req), app_name (query) |
| GET | `/users/{id}/comments` | Get user comment history | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/connected_wallets` | Get the User's ERC and SPL connected wallets | id (path, req), app_name (query) |
| GET | `/users/{id}/developer_apps` | Gets the developer apps that the user owns | id (path, req), app_name (query) |
| GET | `/users/{id}/favorites` | Gets a user's favorite tracks | id (path, req), app_name (query) |
| GET | `/users/{id}/followers` | All users that follow the provided user | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/following` | All users that the provided user follows | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/listen_counts_monthly` | Gets the listen data for a user by month and track within a given time frame. | id (path, req), start_time (query, req), end_time (query, req), app_name (query) |
| GET | `/users/{id}/muted` | Gets users muted by the given user | id (path, req), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/mutuals` | Get intersection of users that follow followeeUserId and users that are followed by followerUserId | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/playlists` | Gets the playlists created by a user using their user ID | id (path, req), offset (query), limit (query), user_id (query), sort_method (query), query (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/purchasers` | Gets the list of unique users who have purchased content by the given user | id (path, req), offset (query), limit (query), user_id (query), content_type (query), content_id (query), app_name (query) |
| GET | `/users/{id}/purchases/download` | Downloads the purchases the user has made as a CSV file | id (path, req), user_id (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/recommended-tracks` | Gets the recommended tracks for the user | id (path, req), offset (query), limit (query), user_id (query), time_range (query), app_name (query) |
| GET | `/users/{id}/related` | Gets a list of users that might be of interest to followers of this user. | id (path, req), offset (query), limit (query), user_id (query), filter_followed (query), app_name (query) |
| GET | `/users/{id}/remixers` | Gets the list of unique users who have remixed tracks by the given user, or a specific track by that user if provided | id (path, req), offset (query), limit (query), user_id (query), track_id (query), app_name (query) |
| GET | `/users/{id}/reposts` | Gets the given user's reposts | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/sales/aggregate` | Gets the aggregated sales data for the user | id (path, req), offset (query), limit (query), user_id (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/sales/download` | Downloads the sales the user has made as a CSV file | id (path, req), user_id (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/sales/download/json` | Gets the sales data for the user in JSON format | id (path, req), user_id (query), grantee_user_id (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/subscribers` | All users that subscribe to the provided user | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/supporters` | Gets the supporters of the given user | id (path, req), offset (query), limit (query), app_name (query) |
| GET | `/users/{id}/supporting` | Gets the users that the given user supports | id (path, req), offset (query), limit (query), app_name (query) |
| GET | `/users/{id}/tags` | Fetch most used tags in a user's tracks | id (path, req), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/tracks` | Gets the tracks created by a user using their user ID | id (path, req), offset (query), limit (query), user_id (query), sort (query), query (query), sort_method (query), sort_direction (query), filter_tracks (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{id}/tracks/remixed` | Gets tracks owned by the user which have been remixed by another track | id (path, req), offset (query), limit (query), user_id (query), app_name (query) |
| GET | `/users/{id}/withdrawals/download` | Downloads the USDC withdrawals the user has made as a CSV file | id (path, req), user_id (query), Encoded-Data-Message (header), Encoded-Data-Signature (header), app_name (query) |
| GET | `/users/{receiving_user_id}/emails/{grantor_user_id}/key` | Gets the encrypted key for email access between the receiving user and granting user. | receiving_user_id (path, req), grantor_user_id (path, req), app_name (query) |

## Undocumented Endpoints (Local Notes)

The following endpoints are noted in `undocumented_endpoints.md` and may change without notice:

- GET /v1/users/{user_id}/now-playing

## Write Endpoints (Unofficial, SDK‑Backed)

The following write actions are documented in `write_endpoints.md` (unofficial):

- Upload Track
- Update Track
- Delete Track
- Favorite/Unfavorite Track
- Repost/Unrepost Track
- Update User Metadata
- Follow/Unfollow User
- Support/Unsupport User
- Create Playlist
- Update Playlist
- Delete Playlist
- Add/Remove Track to Playlist
- Favorite/Unfavorite Playlist
- Create Album
- Update Album
- Delete Album
- Add/Remove Track to Album
- Favorite/Unfavorite Album

Refer to `write_endpoints.md` for full details and examples.
