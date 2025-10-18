import { list } from "@vercel/blob";

const BLOB_PREFIX = "emblems";

export const ensureBlobToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }
  return token;
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
  const prefix = buildPrefix(userId);
  const { blobs } = await list({ prefix, token });

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

export const getLatestBlobUrls = async (
  userIds: Array<string | null | undefined>,
  token?: string
) => {
  const uniqueIds = Array.from(
    new Set(
      userIds
        .map((id) => {
          try {
            return typeof id === "string" ? toSafeUserId(id) : null;
          } catch {
            return null;
          }
        })
        .filter((id): id is string => !!id)
    )
  );

  if (!uniqueIds.length) {
    return {};
  }

  const resolvedToken = token ?? ensureBlobToken();

  const entries = await Promise.all(
    uniqueIds.map(async (userId) => {
      try {
        const url = await getLatestBlobUrl(userId, resolvedToken);
        return [userId, url ?? null] as const;
      } catch (error) {
        console.error(`Failed to fetch emblem for ${userId}`, error);
        return [userId, null] as const;
      }
    })
  );

  return Object.fromEntries(entries) as Record<string, string | null>;
};
