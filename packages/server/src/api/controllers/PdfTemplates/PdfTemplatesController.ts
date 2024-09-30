import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import BaseController from '@/api/controllers/BaseController';
import { PdfTemplateApplication } from '@/services/PdfTemplate/PdfTemplateApplication';

@Service()
export class PdfTemplatesController extends BaseController {
  @Inject()
  public pdfTemplateApplication: PdfTemplateApplication;

  /**
   * Router constructor method.
   */
  public router() {
    const router = Router();

    router.delete(
      '/:template_id',
      [param('template_id').exists().isInt().toInt()],
      this.validationResult,
      this.deletePdfTemplate.bind(this)
    );
    router.post(
      '/:template_id',
      [
        param('template_id').exists().isInt().toInt(),
        check('template_name').exists(),
        check('attributes').exists(),
      ],
      this.validationResult,
      this.editPdfTemplate.bind(this)
    );
    router.get('/state', this.getOrganizationBrandingState.bind(this));
    router.get(
      '/',
      [query('resource').optional()],
      this.validationResult,
      this.getPdfTemplates.bind(this)
    );
    router.get(
      '/:template_id',
      [param('template_id').exists().isInt().toInt()],
      this.validationResult,
      this.getPdfTemplate.bind(this)
    );
    router.post(
      '/',
      [
        check('template_name').exists(),
        check('resource').exists(),
        check('attributes').exists(),
      ],
      this.validationResult,
      this.createPdfInvoiceTemplate.bind(this)
    );
    router.post(
      '/:template_id/assign_default',
      [param('template_id').exists().isInt().toInt()],
      this.validationResult,
      this.assginPdfTemplateAsDefault.bind(this)
    );
    return router;
  }

  async createPdfInvoiceTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { templateName, resource, attributes } = this.matchedBodyData(req);

    try {
      const result = await this.pdfTemplateApplication.createPdfTemplate(
        tenantId,
        templateName,
        resource,
        attributes
      );
      return res.status(201).send({
        id: result.id,
        message: 'The PDF template has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async editPdfTemplate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { template_id: templateId } = req.params;
    const editTemplateDTO = this.matchedBodyData(req);

    try {
      const result = await this.pdfTemplateApplication.editPdfTemplate(
        tenantId,
        Number(templateId),
        editTemplateDTO
      );
      return res.status(200).send({
        id: result.id,
        message: 'The PDF template has been updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePdfTemplate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { template_id: templateId } = req.params;

    try {
      await this.pdfTemplateApplication.deletePdfTemplate(
        tenantId,
        Number(templateId)
      );
      return res.status(204).send({
        id: templateId,
        message: 'The PDF template has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPdfTemplate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { template_id: templateId } = req.params;

    try {
      const template = await this.pdfTemplateApplication.getPdfTemplate(
        tenantId,
        Number(templateId)
      );
      return res.status(200).send(template);
    } catch (error) {
      next(error);
    }
  }

  async getPdfTemplates(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const query = this.matchedQueryData(req);

    try {
      const templates = await this.pdfTemplateApplication.getPdfTemplates(
        tenantId,
        query
      );
      return res.status(200).send(templates);
    } catch (error) {
      next(error);
    }
  }

  async assginPdfTemplateAsDefault(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { template_id: templateId } = req.params;

    try {
      await this.pdfTemplateApplication.assignPdfTemplateAsDefault(
        tenantId,
        Number(templateId)
      );
      return res.status(204).send({
        id: templateId,
        message: 'The given pdf template has been assigned as default template',
      });
    } catch (error) {
      next(error);
    }
  }
  async getOrganizationBrandingState(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const data =
        await this.pdfTemplateApplication.getPdfTemplateBrandingState(tenantId);

      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
