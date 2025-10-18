import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const toSafeUserId = (raw: string) => {
  const sanitized = raw.replaceAll("..", "").replaceAll("\\", "").replaceAll("?", "").trim();
  if (!sanitized || sanitized.includes("/")) {
    throw new Error("Invalid userId");
  }
  return sanitized;
};

const toSafeFilename = (raw: string) => {
  const base = path.basename(raw);
  if (!base) {
    throw new Error("Invalid file name");
  }
  return base;
};

const buildEmblemUrl = (userId: string, fileName: string) =>
  `/${encodeURIComponent(userId)}/${encodeURIComponent(fileName)}`;

export async function GET(request: NextRequest) {
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

  const userDir = path.join(PUBLIC_DIR, safeUserId);

  try {
    const entries = await fs.readdir(userDir, { withFileTypes: true });
    const currentEmblem = entries.find((entry) => entry.isFile());

    if (!currentEmblem) {
      return NextResponse.json({ url: null });
    }

    return NextResponse.json({
      url: buildEmblemUrl(userId, currentEmblem.name),
    });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ url: null });
    }
    console.error("Failed to read emblem directory", error);
    return NextResponse.json({ error: "Failed to load emblem" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

  const userDir = path.join(PUBLIC_DIR, safeUserId);

  try {
    await fs.mkdir(userDir, { recursive: true });
    const entries = await fs.readdir(userDir, { withFileTypes: true });

    await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map((entry) => fs.unlink(path.join(userDir, entry.name)))
    );

    const safeFileName = toSafeFilename(emblemFile.name);
    const emblemPath = path.join(userDir, safeFileName);
    const arrayBuffer = await emblemFile.arrayBuffer();
    await fs.writeFile(emblemPath, new Uint8Array(arrayBuffer));

    return NextResponse.json(
      { url: buildEmblemUrl(userId, safeFileName) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save emblem", error);
    return NextResponse.json({ error: "Failed to save emblem" }, { status: 500 });
  }
}
