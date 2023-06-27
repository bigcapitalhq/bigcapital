import fs from 'fs';
import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from "exceptions";
import { IMedia, IMediaService } from '@/interfaces';
import { difference } from 'lodash';

const fsPromises = fs.promises;

const ERRORS = {
  MIMETYPE_NOT_SUPPORTED: 'MIMETYPE_NOT_SUPPORTED',
  MEDIA_NOT_FOUND: 'MEDIA_NOT_FOUND',
  MODEL_NAME_HAS_NO_MEDIA: 'MODEL_NAME_HAS_NO_MEDIA',
  MODEL_ID_NOT_FOUND: 'MODEL_ID_NOT_FOUND',
  MEDIA_IDS_NOT_FOUND: 'MEDIA_IDS_NOT_FOUND',
  MEDIA_LINK_EXISTS: 'MEDIA_LINK_EXISTS'
}
const publicPath = 'storage/app/public/';
const attachmentsMimes = ['image/png', 'image/jpeg'];

@Service()
export default class MediaService implements IMediaService {
  @Inject('logger')
  logger: any;

  @Inject()
  tenancy: TenancyService;

  @Inject('repositories')
  sysRepositories: any;

  /**
   * Retrieve media model or throw not found error
   * @param tenantId 
   * @param mediaId 
   */
  async getMediaOrThrowError(tenantId: number, mediaId: number) {
    const { Media } = this.tenancy.models(tenantId);
    const foundMedia = await Media.query().findById(mediaId);

    if (!foundMedia) {
      throw new ServiceError(ERRORS.MEDIA_NOT_FOUND);
    }
    return foundMedia;
  }

  /**
   * Retrieve media models by the given ids or throw not found error.
   * @param {number} tenantId 
   * @param {number[]} mediaIds 
   */
  async getMediaByIdsOrThrowError(tenantId: number, mediaIds: number[]) {
    const { Media } = this.tenancy.models(tenantId);
    const foundMedia = await Media.query().whereIn('id', mediaIds);

    const storedMediaIds = foundMedia.map((m) => m.id);
    const notFoundMedia = difference(mediaIds, storedMediaIds);

    if (notFoundMedia.length > 0) {
      throw new ServiceError(ERRORS.MEDIA_IDS_NOT_FOUND);
    }
    return foundMedia;
  }

  /**
   * Validates the model name and id.
   * @param {number} tenantId 
   * @param {string} modelName 
   * @param {number} modelId 
   */
  async validateModelNameAndIdExistence(tenantId: number, modelName: string, modelId: number) {
    const models = this.tenancy.models(tenantId);
    this.logger.info('[media] trying to validate model name and id.', { tenantId, modelName, modelId });

    if (!models[modelName]) {
      this.logger.info('[media] model name not found.', { tenantId, modelName, modelId });
      throw new ServiceError(ERRORS.MODEL_NAME_HAS_NO_MEDIA);
    }
    if (!models[modelName].media) {
      this.logger.info('[media] model is not media-able.', { tenantId, modelName, modelId });
      throw new ServiceError(ERRORS.MODEL_NAME_HAS_NO_MEDIA);
    }

    const foundModel = await models[modelName].query().findById(modelId);

    if (!foundModel) {
      this.logger.info('[media] model is not found.', { tenantId, modelName, modelId });
      throw new ServiceError(ERRORS.MODEL_ID_NOT_FOUND);
    }
  }

  /**
   * Validates the media existence.
   * @param {number} tenantId 
   * @param {number} mediaId 
   * @param {number} modelId 
   * @param {string} modelName 
   */
  async validateMediaLinkExistence(
    tenantId: number,
    mediaId: number,
    modelId: number,
    modelName: string
  ) {
    const { MediaLink } = this.tenancy.models(tenantId);

    const foundMediaLinks = await MediaLink.query()
      .where('media_id', mediaId)
      .where('model_id', modelId)
      .where('model_name', modelName);
    
    if (foundMediaLinks.length > 0) {
      throw new ServiceError(ERRORS.MEDIA_LINK_EXISTS);
    }
  }

  /**
   * Links the given media to the specific media-able model resource.
   * @param {number} tenantId 
   * @param {number} mediaId 
   * @param {number} modelId 
   * @param {string} modelType 
   */
  async linkMedia(tenantId: number, mediaId: number, modelId: number, modelName: string) {
    this.logger.info('[media] trying to link media.', { tenantId, mediaId, modelId, modelName });
    const { MediaLink } = this.tenancy.models(tenantId);
    await this.validateMediaLinkExistence(tenantId, mediaId, modelId, modelName);

    const media = await this.getMediaOrThrowError(tenantId, mediaId);
    await this.validateModelNameAndIdExistence(tenantId, modelName, modelId);

    await MediaLink.query().insert({ mediaId, modelId, modelName });
  }

  /**
   * Retrieve media metadata.
   * @param {number} tenantId - Tenant id.
   * @param {number} mediaId - Media id.
   * @return {Promise<IMedia>}
   */
  public async getMedia(tenantId: number, mediaId: number): Promise<IMedia> {
    this.logger.info('[media] try to get media.', { tenantId, mediaId });
    return this.getMediaOrThrowError(tenantId, mediaId);
  }

  /**
   * Deletes the given media.
   * @param {number} tenantId 
   * @param {number} mediaId 
   * @return {Promise<void>}
   */
  public async deleteMedia(tenantId: number, mediaId: number|number[]): Promise<void> {
    const { Media, MediaLink } = this.tenancy.models(tenantId);
    const { tenantRepository } = this.sysRepositories;

    this.logger.info('[media] trying to delete media.', { tenantId, mediaId });

    const mediaIds = Array.isArray(mediaId) ? mediaId : [mediaId];

    const tenant = await tenantRepository.findOneById(tenantId);
    const media = await this.getMediaByIdsOrThrowError(tenantId, mediaIds);

    const tenantPath = `${publicPath}${tenant.organizationId}`;
    const unlinkOpers = [];

    media.forEach((mediaModel) => {
      const oper = fsPromises.unlink(`${tenantPath}/${mediaModel.attachmentFile}`);
      unlinkOpers.push(oper);
    });
    await Promise.all(unlinkOpers)
      .then((resolved) => {
        resolved.forEach(() => {
          this.logger.info('[attachment] file has been deleted.');
        }); 
      })
      .catch((errors) => {  
        this.logger.info('[attachment] Delete item attachment file delete failed.', { errors });
      });
    await MediaLink.query().whereIn('media_id', mediaIds).delete();
    await Media.query().whereIn('id', mediaIds).delete();
  }

  /**
   * Uploads the given attachment.
   * @param {number} tenantId - 
   * @param {any} attachment - 
   * @return {Promise<IMedia>}
   */
  public async upload(tenantId: number, attachment: any, modelName?: string, modelId?: number): Promise<IMedia> {
    const { tenantRepository } = this.sysRepositories;
    const { Media } = this.tenancy.models(tenantId);

    this.logger.info('[media] trying to upload media.', { tenantId });

    const tenant = await tenantRepository.findOneById(tenantId);
    const fileName = `${attachment.md5}.png`;

    // Validate the attachment.
    if (attachment && attachmentsMimes.indexOf(attachment.mimetype) === -1) {
      throw new ServiceError(ERRORS.MIMETYPE_NOT_SUPPORTED);
    }
    if (modelName && modelId) {
      await this.validateModelNameAndIdExistence(tenantId, modelName, modelId);
    }
    try {
      await attachment.mv(`${publicPath}${tenant.organizationId}/${fileName}`);
      this.logger.info('[attachment] uploaded successfully');
    } catch (error) {
      this.logger.info('[attachment] uploading failed.', { error });
    }
    const media = await Media.query().insertGraph({
      attachmentFile: `${fileName}`,
      ...(modelName && modelId) ? {
        links: [{
          modelName,
          modelId,  
        }]
      } : {},
    });
    this.logger.info('[media] uploaded successfully.', { tenantId, fileName, modelName, modelId });
    return media;
  }
}