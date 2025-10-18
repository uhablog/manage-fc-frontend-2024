import { getSession } from "@auth0/nextjs-auth0";
import { list, put, del } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const BLOB_PREFIX = "emblems";

const ensureToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }
  return token;
};

const toSafeUserId = (raw: string) => {
  const sanitized = raw.replaceAll("..", "").replaceAll("\\", "").replaceAll("?", "").trim();
  if (!sanitized || sanitized.includes("/")) {
    throw new Error("Invalid userId");
  }
  return sanitized;
};

const buildPrefix = (userId: string) => `${BLOB_PREFIX}/${userId}/`;

const getLatestBlobUrl = async (userId: string, token: string) => {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let safeUserId: string;
    try {
      safeUserId = toSafeUserId(userId);
    } catch {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const session = await getSession();

    if (!session?.user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = ensureToken();
    const url = await getLatestBlobUrl(safeUserId, token);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to load emblem from blob storage", error);
    return NextResponse.json({ error: "Failed to load emblem" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const emblemFile = formData.get("emblem");

    if (typeof userId !== "string" || !(emblemFile instanceof File)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const session = await getSession();

    if (!session?.user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.sub !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!emblemFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Emblem must be an image file" }, { status: 400 });
    }

    let safeUserId: string;
    try {
      safeUserId = toSafeUserId(userId);
    } catch {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const token = ensureToken();
    const prefix = buildPrefix(safeUserId);
    const arrayBuffer = await emblemFile.arrayBuffer();

    const { blobs } = await list({ prefix, token });
    if (blobs.length) {
      await Promise.all(
        blobs.map((blob) =>
          del(blob.url, { token }).catch((err) => {
            console.error("Failed to remove old emblem", err);
          })
        )
      );
    }

    const key = `${prefix}${randomUUID()}`;
    const { url } = await put(key, arrayBuffer, {
      access: "public",
      contentType: emblemFile.type,
      token,
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Failed to save emblem to blob storage", error);
    return NextResponse.json({ error: "Failed to save emblem" }, { status: 500 });
  }
}
