import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { del, list, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  buildPrefix,
  ensureBlobToken,
  getLatestBlobUrl,
  toSafeUserId,
  fetchEmblemUrlFromDb,
  saveEmblemUrlToDb,
} from "@/libs/emblem";

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

    let url: string | null = null;
    try {
      const accessTokenResult = await getAccessToken();
      if (accessTokenResult?.accessToken) {
        url = await fetchEmblemUrlFromDb(userId, accessTokenResult.accessToken);
      }
    } catch (error) {
      console.error("Failed to load emblem from database", error);
    }

    if (!url) {
      try {
        const blobToken = ensureBlobToken();
        url = await getLatestBlobUrl(safeUserId, blobToken);
      } catch (blobError) {
        console.error("Failed to load emblem from blob storage", blobError);
      }
    }

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

    const blobToken = ensureBlobToken();
    const prefix = buildPrefix(safeUserId);
    const arrayBuffer = await emblemFile.arrayBuffer();

    const { blobs } = await list({ prefix, token: blobToken });
    console.log('listでblobを取得: route.ts');
    if (blobs.length) {
      await Promise.all(
        blobs.map((blob) =>
          del(blob.url, { token: blobToken }).catch((err) => {
            console.error("Failed to remove old emblem", err);
          })
        )
      );
    }

    const key = `${prefix}${randomUUID()}`;
    const { url } = await put(key, arrayBuffer, {
      access: "public",
      contentType: emblemFile.type,
      token: blobToken,
    });

    try {
      const accessTokenResult = await getAccessToken();
      if (accessTokenResult?.accessToken) {
        await saveEmblemUrlToDb(url, accessTokenResult.accessToken);
      }
    } catch (error) {
      console.error("Failed to persist emblem url in database", error);
    }

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Failed to save emblem to blob storage", error);
    return NextResponse.json({ error: "Failed to save emblem" }, { status: 500 });
  }
}
