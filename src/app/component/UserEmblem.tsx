import { ChangeEvent, useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  userId: string;
};

const CACHE_BUSTER_PARAM = "t";

const withCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${CACHE_BUSTER_PARAM}=${Date.now()}`;
};

const UserEmblem = ({ userId }: Props) => {
  const [emblemUrl, setEmblemUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadEmblem = useCallback(async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user/emblem?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        throw new Error("Failed to fetch emblem");
      }

      const data: { url: string | null } = await response.json();
      setEmblemUrl(data.url ? withCacheBuster(data.url) : null);
    } catch (err) {
      console.error(err);
      setError("エンブレムの取得に失敗しました。");
      setEmblemUrl(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadEmblem();
  }, [loadEmblem]);

  const createCircularImage = async (file: File): Promise<File> => {
    const imageUrl = URL.createObjectURL(file);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
      });

      const size = Math.min(image.width, image.height);
      const offsetX = (image.width - size) / 2;
      const offsetY = (image.height - size) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, offsetX, offsetY, size, size, 0, 0, size, size);
      ctx.restore();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        }, "image/png");
      });

      const baseName = file.name.replace(/\.[^/.]+$/, "");
      return new File([blob], `${baseName}-circle.png`, { type: "image/png" });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      let processedFile = file;

      try {
        processedFile = await createCircularImage(file);
      } catch (processingError) {
        console.error(processingError);
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("emblem", processedFile);

      const response = await fetch("/api/user/emblem", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload emblem");
      }

      const data: { url: string } = await response.json();
      setEmblemUrl(withCacheBuster(data.url));
      setSuccess("エンブレムを更新しました。");
    } catch (err) {
      console.error(err);
      setError("エンブレムの更新に失敗しました。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">チームエンブレム</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Box
            sx={{
              alignItems: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              height: 200,
              justifyContent: "center",
              p: 2,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : emblemUrl ? (
              <NextImage
                src={emblemUrl}
                alt="Team emblem"
                width={160}
                height={160}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <Typography color="text.secondary">エンブレムが設定されていません。</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" component="label" disabled={uploading}>
              {uploading ? "アップロード中..." : "エンブレムを選択"}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            <Button variant="outlined" onClick={loadEmblem} disabled={loading || uploading}>
              最新の表示に更新
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserEmblem;
