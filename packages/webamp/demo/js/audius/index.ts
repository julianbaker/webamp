import {
  AudiusResolveResult,
  AudiusTrack,
  AudiusUser,
} from "./types";
import { Track } from "../../../js/types";
import {
  fetchPlaylistTracks,
  fetchSearchTracks,
  fetchTrendingTracks,
  fetchUserTracks,
  getStreamUrl,
  resolveAudiusUrlRaw,
} from "./client";
import { mapAudiusTracks, trackToWebampTrack } from "./mappers";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveType(data: AudiusTrack | AudiusUser): "track" | "user";
function resolveType(data: unknown): "track" | "playlist" | "user" | "unknown";
function resolveType(data: unknown): "track" | "playlist" | "user" | "unknown" {
  if (!isRecord(data)) {
    return "unknown";
  }

  if ("playlist_name" in data || "is_album" in data) {
    return "playlist";
  }

  if ("user" in data || "title" in data) {
    return "track";
  }

  if ("handle" in data || "name" in data) {
    return "user";
  }

  return "unknown";
}

function getPlaylistName(data: Record<string, unknown>): string | null {
  const playlistName = data["playlist_name"];
  if (typeof playlistName === "string") {
    return playlistName;
  }

  const title = data["title"];
  if (typeof title === "string") {
    return title;
  }

  return null;
}

function getId(data: Record<string, unknown>): string | null {
  const id = data.id;
  if (typeof id === "string") {
    return id;
  }

  if (typeof id === "number") {
    return String(id);
  }

  return null;
}

export async function getTrendingTracks(
  limit = 20,
  offset = 0
): Promise<Track[]> {
  try {
    const tracks = await fetchTrendingTracks(limit, offset);
    return await mapAudiusTracks(tracks);
  } catch (error) {
    console.error("Failed to fetch Audius trending tracks", error);
    return [];
  }
}

export async function searchTracks(
  query: string,
  limit = 20,
  offset = 0
): Promise<Track[]> {
  try {
    const tracks = await fetchSearchTracks(query, limit, offset);
    return await mapAudiusTracks(tracks);
  } catch (error) {
    console.error("Failed to search Audius tracks", error);
    return [];
  }
}

export async function getPlaylistTracks(
  playlistId: string,
  album?: string | null
): Promise<Track[]> {
  const tracks = await fetchPlaylistTracks(playlistId);
  return await mapAudiusTracks(tracks, { album: album ?? undefined });
}

export async function getUserTracks(
  userId: string
): Promise<Track[]> {
  const tracks = await fetchUserTracks(userId);
  return await mapAudiusTracks(tracks);
}

export async function resolveAudiusUrl(
  url: string
): Promise<AudiusResolveResult> {
  const resolved = await resolveAudiusUrlRaw(url);
  const type = resolveType(resolved);

  if (!isRecord(resolved)) {
    throw new Error("Unexpected Audius resolve response");
  }

  switch (type) {
    case "track": {
      const track = await trackToWebampTrack(resolved as AudiusTrack);
      if (!track) {
        throw new Error("Resolved Audius track is not streamable");
      }
      const trackId = getId(resolved) || "";
      return {
        type: "track",
        track,
        trackId,
      };
    }
    case "playlist": {
      const playlistId = getId(resolved);
      if (!playlistId) {
        throw new Error("Resolved Audius playlist missing id");
      }
      const playlistName = getPlaylistName(resolved);
      const tracks = await getPlaylistTracks(playlistId, playlistName);
      return {
        type: "playlist",
        tracks,
        playlistId,
        playlistName,
      };
    }
    case "user": {
      const userId = getId(resolved);
      if (!userId) {
        throw new Error("Resolved Audius user missing id");
      }
      const tracks = await getUserTracks(userId);
      return {
        type: "user",
        tracks,
        userId,
        user: resolved as AudiusUser,
      };
    }
    default:
      throw new Error("Unsupported Audius URL");
  }
}

export { getStreamUrl };
export { AudiusApiError } from "./client";
export { mapAudiusTracks, trackToWebampTrack } from "./mappers";
export type { AudiusResolveResult };
