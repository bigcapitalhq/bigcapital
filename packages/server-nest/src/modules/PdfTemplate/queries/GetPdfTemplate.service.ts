import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { GetPdfTemplateTransformer } from './GetPdfTemplate.transformer';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetPdfTemplateService {
  constructor(
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves a pdf template by its ID.
   * @param {number} templateId - The ID of the pdf template to retrieve.
   * @return {Promise<any>} - The retrieved pdf template.
   */
  async getPdfTemplate(
    templateId: number,
    trx?: Knex.Transaction,
  ): Promise<any> {
    const template = await this.pdfTemplateModel()
      .query(trx)
      .findById(templateId)
      .throwIfNotFound();

    return this.transformer.transform(
      template,
      new GetPdfTemplateTransformer(),
    );
  }
}
