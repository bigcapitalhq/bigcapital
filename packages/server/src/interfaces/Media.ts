

export interface IMedia {
  id?: number,
  attachmentFile: string,
  createdAt?: Date,
};

export interface IMediaLink {
  mediaId: number,
  modelName: string,
  modelId: number,
};

export interface IMediaLinkDTO {
  modelName: string,
  modelId: number,
};

export interface IMediaService {
  linkMedia(tenantId: number, mediaId: number, modelId?: number, modelName?: string): Promise<void>;
  getMedia(tenantId: number, mediaId: number): Promise<IMedia>;
  deleteMedia(tenantId: number, mediaId: number | number[]): Promise<void>;
  upload(tenantId: number, attachment: any, modelName?: string, modelId?: number): Promise<IMedia>;
}