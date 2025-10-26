import { list } from "@vercel/blob";

const BLOB_PREFIX = "emblems";
const EMBLEM_ENDPOINT_PATH = "/api/user/emblem";

export const ensureBlobToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }
  return token;
};

const ensureApiEndpoint = () => {
  const endpoint = process.env.API_ENDPOINT;
  if (!endpoint) {
    throw new Error("Missing API_ENDPOINT");
  }
  return endpoint;
};

export const toSafeUserId = (raw: string) => {
  const sanitized = raw.replaceAll("..", "").replaceAll("\\", "").replaceAll("?", "").trim();
  if (!sanitized || sanitized.includes("/")) {
    throw new Error("Invalid userId");
  }
  return sanitized;
};

export const buildPrefix = (userId: string) => `${BLOB_PREFIX}/${userId}/`;

export const getLatestBlobUrl = async (userId: string, token: string) => {
  console.log(userId);
  const prefix = buildPrefix(userId);
  const { blobs } = await list({ prefix, token });
  console.log('listでblobを取得: emblem.ts');

  if (!blobs.length) {
    return null;
  }

  const latestBlob = blobs.reduce((latest, current) => {
    if (!latest) {
      return current;
    }
    return new Date(current.uploadedAt) > new Date(latest.uploadedAt) ? current : latest;
  });

  return latestBlob?.url ?? null;
};

export const fetchEmblemUrlFromDb = async (userId: string, token: string) => {
  const endpoint = ensureApiEndpoint();
  const res = await fetch(
    `${endpoint}${EMBLEM_ENDPOINT_PATH}?auth0_user_id=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch emblem url for ${userId}`);
  }

  const json = await res.json();
  return json?.emblem_url ?? null;
};

export const saveEmblemUrlToDb = async (emblemUrl: string, token?: string) => {
  if (!token) {
    throw new Error("Missing access token to save emblem url");
  }

  const endpoint = ensureApiEndpoint();
  const res = await fetch(`${endpoint}${EMBLEM_ENDPOINT_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emblem_url: emblemUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to persist emblem url");
  }

  return res.json().catch(() => undefined);
};
