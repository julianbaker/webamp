import { Track } from "../types";
import { getStreamUrl } from "./client";
import { AudiusArtwork, AudiusTrack } from "./types";

export type TrackMappingOptions = {
  album?: string | null;
};

function getBestArtworkUrl(artwork?: AudiusArtwork): string | undefined {
  if (!artwork) {
    return undefined;
  }

  return artwork["480x480"] || artwork["150x150"] || undefined;
}

function isStreamableTrack(track: AudiusTrack): boolean {
  const isStreamable = track["is_streamable"];
  if (isStreamable === true) {
    return true;
  }

  if (track.streamable === true) {
    return true;
  }

  return false;
}

function getArtistName(track: AudiusTrack): string {
  const user = track.user;
  return user?.name || user?.handle || "Unknown Artist";
}

function getTitle(track: AudiusTrack): string {
  return track.title || "Unknown Title";
}

export async function trackToWebampTrack(
  track: AudiusTrack,
  options: TrackMappingOptions = {}
): Promise<Track | null> {
  if (!isStreamableTrack(track)) {
    return null;
  }

  const streamUrl = await getStreamUrl(String(track.id));
  const albumArtUrl = getBestArtworkUrl(track.artwork || undefined);
  const duration =
    typeof track.duration === "number" ? track.duration : undefined;

  return {
    url: streamUrl,
    metaData: {
      artist: getArtistName(track),
      title: getTitle(track),
      ...(options.album ? { album: options.album } : {}),
      ...(albumArtUrl ? { albumArtUrl } : {}),
    },
    ...(duration !== undefined ? { duration } : {}),
  };
}

export async function mapAudiusTracks(
  tracks: AudiusTrack[],
  options: TrackMappingOptions = {}
): Promise<Track[]> {
  const results = await Promise.all(
    tracks.map(async (track) => {
      if (!isStreamableTrack(track)) {
        return null;
      }

      try {
        return await trackToWebampTrack(track, options);
      } catch (error) {
        console.warn("Failed to map Audius track", track.id, error);
        return null;
      }
    })
  );

  return results.filter((track): track is Track => track != null);
}
