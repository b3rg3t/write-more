import { IBase } from "./IBase";

export interface ITripImage extends IBase {
  originalName: string;
  uploadedAt: string;
  thumbnailContentType?: string;
  thumbnailSize?: number;
  snapshotUrl: string;
}
