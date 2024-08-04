import mime from 'mime-types';
import { Service, Inject } from 'typedi';
import { Router, Response, NextFunction, Request } from 'express';
import { body, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { AttachmentsApplication } from '@/services/Attachments/AttachmentsApplication';
import { AttachmentUploadPipeline } from '@/services/Attachments/S3UploadPipeline';

@Service()
export class AttachmentsController extends BaseController {
  @Inject()
  private attachmentsApplication: AttachmentsApplication;

  @Inject()
  private uploadPipelineService: AttachmentUploadPipeline;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      this.uploadPipelineService.validateS3Configured,
      this.uploadPipelineService.uploadPipeline().single('file'),
      this.validateUploadedFileExistance,
      this.uploadAttachment.bind(this)
    );
    router.delete(
      '/:id',
      [param('id').exists()],
      this.validationResult,
      this.deleteAttachment.bind(this)
    );
    router.get(
      '/:id',
      [param('id').exists()],
      this.validationResult,
      this.getAttachment.bind(this)
    );
    router.post(
      '/:id/link',
      [body('modelRef').exists(), body('modelId').exists()],
      this.validationResult
    );
    router.post(
      '/:id/link',
      [body('modelRef').exists(), body('modelId').exists()],
      this.validationResult,
      this.linkDocument.bind(this)
    );
    router.post(
      '/:id/unlink',
      [body('modelRef').exists(), body('modelId').exists()],
      this.validationResult,
      this.unlinkDocument.bind(this)
    );
    router.get(
      '/:id/presigned-url',
      [param('id').exists()],
      this.validationResult,
      this.getAttachmentPresignedUrl.bind(this)
    );
    return router;
  }

  /**
   * Validates the upload file existance.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response|void}
   */
  private validateUploadedFileExistance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.file) {
      return res.boom.badRequest(null, {
        errorType: 'FILE_UPLOAD_FAILED',
        message: 'Now file uploaded.',
      });
    }
    next();
  }

  /**
   * Uploads the attachments to S3 and store the file metadata to DB.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response|void}
   */
  private async uploadAttachment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const file = req.file;

    try {
      const data = await this.attachmentsApplication.upload(tenantId, file);

      return res.status(200).send({
        status: 200,
        message: 'The document has uploaded successfully.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the given attachment key.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async getAttachment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { id } = req.params;

    try {
      const data = await this.attachmentsApplication.get(tenantId, id);

      const byte = await data.Body.transformToByteArray();
      const extension = mime.extension(data.ContentType);
      const buffer = Buffer.from(byte);

      res.set(
        'Content-Disposition',
        `filename="${req.params.id}.${extension}"`
      );
      res.set('Content-Type', data.ContentType);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given document key.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async deleteAttachment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { id: documentId } = req.params;

    try {
      await this.attachmentsApplication.delete(tenantId, documentId);

      return res.status(200).send({
        status: 200,
        message: 'The document has been delete successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Links the given document key.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async linkDocument(
    req: Request,
    res: Response,
    next: Function
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { id: documentId } = req.params;
    const { modelRef, modelId } = this.matchedBodyData(req);

    try {
      await this.attachmentsApplication.link(
        tenantId,
        documentId,
        modelRef,
        modelId
      );
      return res.status(200).send({
        status: 200,
        message: 'The document has been linked successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Links the given document key.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async unlinkDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { id: documentId } = req.params;
    const { modelRef, modelId } = this.matchedBodyData(req);

    try {
      await this.attachmentsApplication.link(
        tenantId,
        documentId,
        modelRef,
        modelId
      );
      return res.status(200).send({
        status: 200,
        message: 'The document has been linked successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retreives the presigned url of the given attachment key.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async getAttachmentPresignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { id: documentKey } = req.params;

    try {
      const presignedUrl = await this.attachmentsApplication.getPresignedUrl(
        tenantId,
        documentKey
      );
      return res.status(200).send({ presignedUrl });
    } catch (error) {
      next(error);
    }
  }
}
