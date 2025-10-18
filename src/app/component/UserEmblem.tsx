import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  userId: string;
};

const CACHE_BUSTER_PARAM = "t";
const CROP_SIZE = 280;

type Crop = {
  x: number;
  y: number;
};

type ImageMeta = {
  width: number;
  height: number;
  baseScale: number;
};

const withCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${CACHE_BUSTER_PARAM}=${Date.now()}`;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });

const UserEmblem = ({ userId }: Props) => {
  const [emblemUrl, setEmblemUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const computeBounds = useCallback(
    (scaleValue: number) => {
      if (!imageMeta) {
        return { maxX: 0, maxY: 0 };
      }

      const scaleFactor = imageMeta.baseScale * scaleValue;
      const scaledWidth = imageMeta.width * scaleFactor;
      const scaledHeight = imageMeta.height * scaleFactor;

      return {
        maxX: Math.max(0, (scaledWidth - CROP_SIZE) / 2),
        maxY: Math.max(0, (scaledHeight - CROP_SIZE) / 2),
      };
    },
    [imageMeta]
  );

  const clampCrop = useCallback(
    (candidate: Crop, scaleValue = scale): Crop => {
      const { maxX, maxY } = computeBounds(scaleValue);
      return {
        x: Math.min(Math.max(candidate.x, -maxX), maxX),
        y: Math.min(Math.max(candidate.y, -maxY), maxY),
      };
    },
    [computeBounds, scale]
  );

  useEffect(() => {
    if (!imageMeta) {
      return;
    }
    setCrop((prev) => clampCrop(prev));
  }, [clampCrop, imageMeta, scale]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const img = await loadImage(result);
          const baseScale = CROP_SIZE / Math.min(img.width, img.height);
          setSelectedFile(file);
          setImageSrc(result);
          setImageMeta({
            width: img.width,
            height: img.height,
            baseScale,
          });
          setCrop({ x: 0, y: 0 });
          setScale(1);
          setCropDialogOpen(true);
          setError(null);
          setSuccess(null);
        } catch (imageError) {
          console.error(imageError);
          setSelectedFile(null);
          setImageSrc(null);
          setImageMeta(null);
          setError("画像の読み込みに失敗しました。別のファイルをお試しください。");
        }
      };
      reader.onerror = () => {
        console.error(reader.error);
        setError("画像ファイルの読み込みに失敗しました。");
      };
      reader.readAsDataURL(file);
    } finally {
      event.target.value = "";
    }
  };

  const resetCroppingState = () => {
    setCropDialogOpen(false);
    setSelectedFile(null);
    setImageSrc(null);
    setImageMeta(null);
    setCrop({ x: 0, y: 0 });
    setScale(1);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadEmblem = async (file: File) => {
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("emblem", file);

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
      return true;
    } catch (err) {
      console.error(err);
      setError("エンブレムの更新に失敗しました。");
      return false;
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const generateCroppedFile = async () => {
    if (!selectedFile || !imageSrc || !imageMeta) {
      throw new Error("画像データが見つかりません。");
    }

    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("トリミング処理に失敗しました。");
    }

    const scaleFactor = imageMeta.baseScale * scale;

    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.translate(CROP_SIZE / 2 + crop.x, CROP_SIZE / 2 + crop.y);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(image, -imageMeta.width / 2, -imageMeta.height / 2);
    ctx.restore();

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("トリミング画像の生成に失敗しました。"));
        }
      }, "image/png");
    });

    const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
    return new File([blob], `${baseName}-circle.png`, { type: "image/png" });
  };

  const handleCropConfirm = async () => {
    if (!selectedFile) {
      return;
    }

    let processedFile = selectedFile;

    try {
      processedFile = await generateCroppedFile();
    } catch (cropError) {
      console.error(cropError);
      setError("トリミングの適用に失敗したため、元の画像でアップロードします。");
    }

    const isSuccess = await uploadEmblem(processedFile);

    if (isSuccess) {
      resetCroppingState();
    }
  };

  const handleCropCancel = () => {
    resetCroppingState();
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setScale(value);
      setCrop((prev) => clampCrop(prev, value));
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!imageMeta) {
      return;
    }

    setIsDragging(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    const { movementX, movementY } = event;
    setCrop((prev) => clampCrop({ x: prev.x + movementX, y: prev.y + movementY }));
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
  };

  const scaleFactor = imageMeta ? imageMeta.baseScale * scale : 1;
  const imageWidth = imageMeta?.width ?? CROP_SIZE;
  const imageHeight = imageMeta?.height ?? CROP_SIZE;

  return (
    <>
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
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Button variant="outlined" onClick={loadEmblem} disabled={loading || uploading}>
                最新の表示に更新
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={cropDialogOpen}
        onClose={uploading ? undefined : handleCropCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>エンブレムをトリミング</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              円形の枠に収まるよう位置をドラッグし、拡大率を調整してください。
            </Typography>
            <Box
              sx={{
                alignSelf: "center",
                position: "relative",
                width: CROP_SIZE,
                height: CROP_SIZE,
                borderRadius: "50%",
                overflow: "hidden",
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endPointerDrag}
              onPointerLeave={endPointerDrag}
            >
              {imageSrc && (
                <Box
                  component="img"
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  sx={{
                    position: "absolute",
                    top: `calc(50% + ${crop.y}px)`,
                    left: `calc(50% + ${crop.x}px)`,
                    width: imageWidth,
                    height: imageHeight,
                    userSelect: "none",
                    transformOrigin: "center",
                    transform: `translate(-50%, -50%) scale(${scaleFactor})`,
                  }}
                />
              )}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
                  pointerEvents: "none",
                }}
              />
            </Box>
            <Slider
              value={scale}
              onChange={handleSliderChange}
              step={0.05}
              min={1}
              max={3}
              marks={[
                { value: 1, label: "1x" },
                { value: 2, label: "2x" },
                { value: 3, label: "3x" },
              ]}
              valueLabelDisplay="auto"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCropCancel} disabled={uploading}>
            キャンセル
          </Button>
          <Button onClick={handleCropConfirm} variant="contained" disabled={uploading}>
            {uploading ? "アップロード中..." : "トリミングを確定"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserEmblem;
