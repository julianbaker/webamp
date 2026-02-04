import {
  AudiusApiResponse,
  AudiusResolveData,
  AudiusTrack,
} from "./types";

const API_BASE_URL = "https://api.audius.co/v1/";
const APP_NAME = "webamp-aud";
const STREAM_URL_TTL_MS = 10 * 60 * 1000;

export class AudiusApiError extends Error {
  status: number;
  url: string;
  body?: string;

  constructor(message: string, status: number, url: string, body?: string) {
    super(message);
    this.name = "AudiusApiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const streamUrlCache = new Map<string, { url: string; expiresAt: number }>();

function buildUrl(path: string, params?: QueryParams): string {
  const safePath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(safePath, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  url.searchParams.set("app_name", APP_NAME);

  return url.toString();
}

async function fetchAudius<T>(path: string, params?: QueryParams): Promise<T> {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.1",
    },
    mode: "cors",
    credentials: "omit",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new AudiusApiError(
      `Audius request failed: ${response.status}`,
      response.status,
      url,
      text
    );
  }

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(`Failed to parse Audius response for ${url}`);
  }
}

function getCachedStreamUrl(trackId: string): string | null {
  const entry = streamUrlCache.get(trackId);
  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    streamUrlCache.delete(trackId);
    return null;
  }

  return entry.url;
}

function setCachedStreamUrl(trackId: string, url: string) {
  streamUrlCache.set(trackId, {
    url,
    expiresAt: Date.now() + STREAM_URL_TTL_MS,
  });
}

function parseStreamUrl(data: unknown): string | null {
  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    const url = (data as { url?: unknown }).url;
    if (typeof url === "string") {
      return url;
    }
  }

  return null;
}

async function fetchStreamUrl(trackId: string): Promise<string> {
  const response = await fetchAudius<AudiusApiResponse<string | { url: string }>>(
    `/tracks/${trackId}/stream`,
    {
      "no_redirect": true,
    }
  );

  const streamUrl = parseStreamUrl(response.data);
  if (!streamUrl) {
    throw new Error(`Audius stream URL missing for track ${trackId}`);
  }

  return streamUrl;
}

export async function getStreamUrl(trackId: string): Promise<string> {
  const cached = getCachedStreamUrl(trackId);
  if (cached) {
    return cached;
  }

  try {
    const streamUrl = await fetchStreamUrl(trackId);
    setCachedStreamUrl(trackId, streamUrl);
    return streamUrl;
  } catch (error) {
    if (shouldRetryStreamUrl(error)) {
      const streamUrl = await fetchStreamUrl(trackId);
      setCachedStreamUrl(trackId, streamUrl);
      return streamUrl;
    }
    throw error;
  }
}

function shouldRetryStreamUrl(error: unknown): boolean {
  if (error instanceof AudiusApiError) {
    return error.status >= 500;
  }

  if (error instanceof TypeError) {
    return true;
  }

  return false;
}

export async function fetchTrendingTracks(
  limit = 20,
  offset = 0
): Promise<AudiusTrack[]> {
  const response = await fetchAudius<AudiusApiResponse<AudiusTrack[]>>(
    "/tracks/trending",
    {
      limit,
      offset,
    }
  );

  return response.data || [];
}

export async function fetchSearchTracks(
  query: string,
  limit = 20,
  offset = 0
): Promise<AudiusTrack[]> {
  const response = await fetchAudius<AudiusApiResponse<AudiusTrack[]>>(
    "/tracks/search",
    {
      query,
      limit,
      offset,
    }
  );

  return response.data || [];
}

export async function fetchPlaylistTracks(
  playlistId: string
): Promise<AudiusTrack[]> {
  const response = await fetchAudius<AudiusApiResponse<AudiusTrack[]>>(
    `/playlists/${playlistId}/tracks`
  );

  return response.data || [];
}

export async function fetchUserTracks(userId: string): Promise<AudiusTrack[]> {
  const response = await fetchAudius<AudiusApiResponse<AudiusTrack[]>>(
    `/users/${userId}/tracks`
  );

  return response.data || [];
}

export async function resolveAudiusUrlRaw(
  url: string
): Promise<AudiusResolveData> {
  const response = await fetchAudius<AudiusApiResponse<AudiusResolveData>>(
    "/resolve",
    {
      url,
    }
  );

  return response.data;
}
