import { useEffect, useState } from "react";

const emblemCache = new Map<string, string | null>();

const toUniqueUserIds = (userIds: Array<string | null | undefined>) => {
  const set = new Set<string>();
  for (const id of userIds) {
    if (typeof id === "string" && id.trim().length > 0) {
      set.add(id);
    }
  }
  return Array.from(set);
};

const fetchEmblem = async (userId: string) => {
  const response = await fetch(`/api/user/emblem?userId=${encodeURIComponent(userId)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch emblem");
  }

  const data: { url: string | null } = await response.json();
  return data.url ?? null;
};

export const useEmblemUrls = (userIds: Array<string | null | undefined>) => {
  const [emblemUrls, setEmblemUrls] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const uniqueUserIds = toUniqueUserIds(userIds);

    if (!uniqueUserIds.length) {
      setEmblemUrls({});
      return;
    }

    let isCancelled = false;

    const loadEmblems = async () => {
      const idsToFetch = uniqueUserIds.filter((id) => !emblemCache.has(id));

      if (idsToFetch.length) {
        const entries = await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const url = await fetchEmblem(id);
              return [id, url] as const;
            } catch {
              return [id, null] as const;
            }
          })
        );

        for (const [id, url] of entries) {
          emblemCache.set(id, url);
        }
      }

      if (isCancelled) {
        return;
      }

      const next: Record<string, string | null> = {};
      for (const id of uniqueUserIds) {
        next[id] = emblemCache.get(id) ?? null;
      }
      setEmblemUrls(next);
    };

    loadEmblems();

    return () => {
      isCancelled = true;
    };
  }, [userIds]);

  return emblemUrls;
};

