import { Service, Inject } from 'typedi';
import { isNull } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';
import { Transformer } from './Transformer';

@Service()
export class TransformerInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the application context of all tenant transformers.
   * @param   {number} tenantId
   * @returns {}
   */
  async getApplicationContext(tenantId: number) {
    const i18n = this.tenancy.i18n(tenantId);
    const organization = await TenantMetadata.query().findOne({ tenantId });

    return {
      organization,
      i18n,
    };
  }

  /**
   * Transforms the given transformer after inject the tenant context.
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
    }
    transformer.setOptions(options);

    return transformer.work(object);
  }
}
