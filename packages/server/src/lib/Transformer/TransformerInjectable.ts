import { Service, Inject } from 'typedi';
import { isNull } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';
import { Transformer } from './Transformer';
import { ImportAls } from '@/services/Import/ImportALS';
import { ExportAls } from '@/services/Export/ExportAls';

@Service()
export class TransformerInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private exportAls: ExportAls;

  /**
   * Retrieves the application context of all tenant transformers.
   * @param   {number} tenantId
   * @returns {}
   */
  async getApplicationContext(tenantId: number) {
    const i18n = this.tenancy.i18n(tenantId);
    const organization = await TenantMetadata.query().findOne({ tenantId });
    const exportAls = this.exportAls;

    return {
      organization,
      i18n,
      exportAls,
    };
  }

  /**
   * Retrieves the given tenatn date format.
   * @param {number} tenantId
   * @returns {string}
   */
  async getTenantDateFormat(tenantId: number) {
    const metadata = await TenantMetadata.query().findOne('tenantId', tenantId);

    return metadata.dateFormat;
  }

  /**
   * Transformes the given transformer after inject the tenant context.
   * @param   {number} tenantId
   * @param   {Record<string, any> | Record<string, any>[]} object
   * @param   {Transformer} transformer
   * @param   {Record<string, any>} options
   * @returns {Record<string, any>}
   */
  async transform(
    tenantId: number,
    object: Record<string, any> | Record<string, any>[],
    transformer: Transformer,
    options?: Record<string, any>
  ) {
    if (!isNull(tenantId)) {
      const context = await this.getApplicationContext(tenantId);
      transformer.setContext(context);

      const dateFormat = await this.getTenantDateFormat(tenantId);
      transformer.setDateFormat(dateFormat);
    }

    transformer.setOptions(options);

    return transformer.work(object);
  }
}
