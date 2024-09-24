import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPdfTemplateTransformer } from './GetPdfTemplateTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetPdfTemplate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable

  /**
   * Retrieves a pdf template by its ID.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} templateId - The ID of the pdf template to retrieve.
   * @return {Promise<any>} - The retrieved pdf template.
   */
  async getPdfTemplate(
    tenantId: number,
    templateId: number,
    trx?: Knex.Transaction
  ): Promise<any> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const template = await PdfTemplate.query(trx)
      .findById(templateId)
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      template,
      new GetPdfTemplateTransformer()
    );
  }
}
