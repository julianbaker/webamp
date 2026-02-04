/* eslint-disable camelcase */
import { Track } from "../types";

export type AudiusApiResponse<T> = {
  data: T;
};

export type AudiusArtwork = {
  "150x150"?: string | null;
  "480x480"?: string | null;
  "1000x1000"?: string | null;
} | null;

export type AudiusUser = {
  id: string | number;
  name?: string | null;
  handle?: string | null;
};

export type AudiusTrack = {
  id: string | number;
  title?: string | null;
  duration?: number | null;
  user?: AudiusUser | null;
  artwork?: AudiusArtwork;
  is_streamable?: boolean;
  streamable?: boolean;
};

export type AudiusPlaylist = {
  id: string | number;
  playlist_name?: string | null;
  title?: string | null;
  is_album?: boolean | null;
};

export type AudiusResolveData = AudiusTrack | AudiusPlaylist | AudiusUser;

export type AudiusResolveResult =
  | {
      type: "track";
      track: Track;
      trackId: string;
    }
  | {
      type: "playlist";
      tracks: Track[];
      playlistId: string;
      playlistName: string | null;
    }
  | {
      type: "user";
      tracks: Track[];
      userId: string;
      user: AudiusUser | null;
    };
