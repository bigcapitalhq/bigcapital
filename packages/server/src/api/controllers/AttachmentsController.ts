import mime from 'mime-types';
import { Service, Inject } from 'typedi';
import { Router, Response } from 'express';
import { param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { Request } from 'express-validator/src/base';
import { AttachmentsApplication } from '@/services/Attachments/AttachmentsApplication';

@Service()
export class AttachmentsController extends BaseController {
  @Inject()
  private attachmentsApplication: AttachmentsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      this.attachmentsApplication.uploadPipeline.single('file'),
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

    return router;
  }

  /**
   * Uploads the attachments to S3 and store the file metadata to DB.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns
   */
  private async uploadAttachment(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const file = req.file;

    try {
      await this.attachmentsApplication.upload(tenantId, file);

      return res.status(200).send({
        status: 200,
        message: 'The document has uploaded successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  private async getAttachment(req: Request, res: Response, next: Function) {
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
   * Delete
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private async deleteAttachment(req: Request, res: Response, next: Function) {
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
}
