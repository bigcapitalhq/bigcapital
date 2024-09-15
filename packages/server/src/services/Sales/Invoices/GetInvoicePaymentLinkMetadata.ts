import moment from 'moment';
import { ServiceError } from '@/exceptions';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PaymentLink } from '@/system/models';
import { Inject, Service } from 'typedi';
import { GeneratePaymentLinkTransformer } from './GeneratePaymentLinkTransformer';
import { GetInvoicePaymentLinkMetaTransformer } from './GetInvoicePaymentLinkTransformer';
import { initalizeTenantServices } from '@/api/middleware/TenantDependencyInjection';

@Service()
export class GetInvoicePaymentLinkMetadata {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the invoice sharable link meta of the link id.
   * @param {number}
   * @param {string} linkId
   */
  async getInvoicePaymentLinkMeta(linkId: string) {
    const paymentLink = await PaymentLink.query()
      .findOne('linkId', linkId)
      .throwIfNotFound();

    // 
    if (paymentLink.resourceType !== 'SaleInvoice') {
      throw new ServiceError('');
    }
    // Validate the expiry at date.
    if (paymentLink.expiryAt) {
      const currentDate = moment();
      const expiryDate = moment(paymentLink.expiryAt);

      if (expiryDate.isBefore(currentDate)) {
        throw new ServiceError('PAYMENT_LINK_EXPIRED');
      }
    }
    const tenantId = paymentLink.tenantId;
    await initalizeTenantServices(tenantId);

    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoice = await SaleInvoice.query()
      .findById(paymentLink.resourceId)
      .withGraphFetched('entries')
      .withGraphFetched('customer')
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      invoice,
      new GetInvoicePaymentLinkMetaTransformer()
    );
  }
}
