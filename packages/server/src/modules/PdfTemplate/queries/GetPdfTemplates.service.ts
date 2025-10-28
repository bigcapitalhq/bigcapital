import { Inject, Injectable } from '@nestjs/common';
import { GetPdfTemplatesTransformer } from './GetPdfTemplates.transformer';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetPdfTemplates {
  constructor(
    private readonly transformInjectable: TransformerInjectable,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
  ) {}

  /**
   * Retrieves a list of PDF templates for a specified tenant.
   * @param {Object} [query] - Optional query parameters to filter the templates.
   * @param {string} [query.resource] - The resource type to filter the templates by.
   * @returns {Promise<any>} - A promise that resolves to the transformed list of PDF templates.
   */
  async getPdfTemplates(query?: { resource?: string }) {
    const templates = await this.pdfTemplateModel()
      .query()
      .onBuild((q) => {
        if (query?.resource) {
          q.where('resource', query?.resource);
        }
        q.orderBy('createdAt', 'ASC');
      });

    return this.transformInjectable.transform(
      templates,
      new GetPdfTemplatesTransformer(),
    );
  }
}
