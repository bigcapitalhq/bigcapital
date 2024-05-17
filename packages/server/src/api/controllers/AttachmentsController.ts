import { Service, Inject } from 'typedi';
import { Router, Response } from 'express';
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
  router() {
    const router = Router();

    router.delete('/:id', this.deleteAttachment.bind(this));
    router.post('/', this.uploadAttachment.bind(this));

    return router;
  }

  private async uploadAttachment(req: Request, res: Response, next: Function) {
    try {
      await this.attachmentsApplication.upload();

      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }

  private deleteAttachment(req: Request, res: Response, next: Function) {}
}
