import { I18nService } from 'nestjs-i18n';
import { Transformer } from './Transformer';
import { Global, Injectable } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TransformerContext } from './Transformer.types';

@Injectable()
export class TransformerInjectable {
  /**
   * @param {TenancyContext} tenancyContext - Tenancy context.
   * @param {I18nService} i18n - I18n service.
   */
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the application context of all tenant transformers.
   * @returns {TransformerContext}
   */
  async getApplicationContext(): Promise<TransformerContext> {
    const tenant = await this.tenancyContext.getTenant(true);
    const organization = tenant.metadata;

    return {
      organization,
      i18n: this.i18n,
      exportAls: {},
    };
  }

  /**
   * Retrieves the given tenatn date format.
   * @returns {string}
   */
  async getTenantDateFormat() {
    const tenant = await this.tenancyContext.getTenant(true);
    return tenant.metadata?.dateFormat;
  }

  /**
   * Transformes the given transformer after inject the tenant context.
   * @param {Record<string, any> | Record<string, any>[]} object
   * @param {Transformer} transformer
   * @param {Record<string, any>} options
   * @returns {Record<string, any>}
   */
  async transform(
    object: Record<string, any> | Record<string, any>[],
    transformer: Transformer,
    options?: Record<string, any>,
  ) {
    const context = await this.getApplicationContext();
    transformer.setContext(context);

    const dateFormat = await this.getTenantDateFormat();

    transformer.setDateFormat(dateFormat || 'DD-MM-YYYY');
    transformer.setOptions(options);

    return transformer.work(object);
  }
}
