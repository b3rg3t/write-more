import mongoose from "mongoose";
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb";
import { Readable } from "stream";

const DEFAULT_BUCKET_NAME = "tripImages";

const getBucketName = (): string =>
  process.env.GRIDFS_BUCKET_NAME || DEFAULT_BUCKET_NAME;

const getTripImageBucket = (): GridFSBucket => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  return new GridFSBucket(db, { bucketName: getBucketName() });
};

type UploadTripImageInput = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  tripId: string;
  userId: string;
};

export const uploadTripImageToGridFs = async ({
  buffer,
  fileName,
  mimeType,
  tripId,
  userId,
}: UploadTripImageInput): Promise<string> => {
  const bucket = getTripImageBucket();

  const fileId = await new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileName, {
      metadata: {
        mimeType,
        tripId,
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      const generatedId = uploadStream.id;

      if (!generatedId || !(generatedId instanceof ObjectId)) {
        reject(new Error("Failed to create GridFS file id"));
        return;
      }

      resolve(generatedId);
    });

    Readable.from(buffer).pipe(uploadStream);
  });

  return fileId.toHexString();
};

export const deleteTripImageFromGridFs = async (
  fileId?: string,
): Promise<void> => {
  if (!fileId) {
    return;
  }

  if (!ObjectId.isValid(fileId)) {
    return;
  }

  const bucket = getTripImageBucket();

  try {
    await bucket.delete(new ObjectId(fileId));
  } catch (err) {
    // Ignore delete errors to avoid failing replacement on stale file ids.
  }
};

export const openTripImageDownloadStream = (
  fileId: string,
): GridFSBucketReadStream => {
  if (!ObjectId.isValid(fileId)) {
    throw new Error("Invalid GridFS file id");
  }

  const bucket = getTripImageBucket();
  return bucket.openDownloadStream(new ObjectId(fileId));
};
