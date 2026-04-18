import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const DEFAULT_MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const parseMaxBytes = (): number => {
  const rawValue = process.env.IMAGE_UPLOAD_MAX_BYTES;

  if (!rawValue) {
    return DEFAULT_MAX_IMAGE_BYTES;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_MAX_IMAGE_BYTES;
  }

  return parsedValue;
};

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseMaxBytes(),
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!SUPPORTED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(
        new Error(
          "Unsupported image type. Allowed: jpeg, png, webp, gif, avif",
        ),
      );
      return;
    }

    cb(null, true);
  },
});

export const uploadTripImageFile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  uploader.single("image")(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        message: `Image is too large. Max size is ${parseMaxBytes()} bytes.`,
      });
      return;
    }

    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(400).json({ message: "Invalid image upload request." });
  });
};
