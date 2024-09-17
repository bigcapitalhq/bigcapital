import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPdfTemplatesTransformer } from './GetPdfTemplatesTransformer';
import { Inject, Service } from 'typedi';

@Service()
export class GetPdfTemplates {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformInjectable: TransformerInjectable;

  /**
   * Retrieves a list of PDF templates for a specified tenant.
   * @param {number} tenantId - The ID of the tenant for which to retrieve templates.
   * @param {Object} [query] - Optional query parameters to filter the templates.
   * @param {string} [query.resource] - The resource type to filter the templates by.
   * @returns {Promise<any>} - A promise that resolves to the transformed list of PDF templates.
   */
  async getPdfTemplates(tenantId: number, query?: { resource?: string }) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const templates = await PdfTemplate.query().onBuild((q) => {
      if (query?.resource) {
        q.where('resource', query?.resource);
      }
      q.orderBy('createdAt', 'ASC');
    });

    return this.transformInjectable.transform(
      tenantId,
      templates,
      new GetPdfTemplatesTransformer()
    );
  }
}
