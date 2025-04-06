import moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { SaleInvoice } from '../SaleInvoices/models/SaleInvoice';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { PaymentLink } from './models/PaymentLink';
import { ServiceError } from '../Items/ServiceError';
import { GetInvoicePaymentLinkMetaTransformer } from '../SaleInvoices/queries/GetInvoicePaymentLink.transformer';
import { ClsService } from 'nestjs-cls';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenantModel } from '../System/models/TenantModel';

@Injectable()
export class GetInvoicePaymentLinkMetadata {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly clsService: ClsService,
    private readonly tenancyContext: TenancyContext,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(PaymentLink.name)
    private readonly paymentLinkModel: typeof PaymentLink,

    @Inject(TenantModel.name)
    private readonly systemTenantModel: typeof TenantModel,
  ) {}

  /**
   * Retrieves the invoice sharable link meta of the link id.
   * @param {string} linkId - Link id.
   */
  async getInvoicePaymentLinkMeta(linkId: string) {
    const paymentLink = await this.paymentLinkModel
      .query()
      .findOne('linkId', linkId)
      .where('resourceType', 'SaleInvoice')
      .throwIfNotFound();

    // Validate the expiry at date.
    if (paymentLink.expiryAt) {
      const currentDate = moment();
      const expiryDate = moment(paymentLink.expiryAt);

      if (expiryDate.isBefore(currentDate)) {
        throw new ServiceError('PAYMENT_LINK_EXPIRED');
      }
    }
    const tenant = await this.systemTenantModel
      .query()
      .findById(paymentLink.tenantId);

    this.clsService.set('organizationId', tenant.organizationId);
    // this.clsService.set('userId', paymentLink.userId);

    const invoice = await this.saleInvoiceModel()
      .query()
      .findById(paymentLink.resourceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('taxes.taxRate')
      .withGraphFetched('paymentMethods.paymentIntegration')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    return this.transformer.transform(
      invoice,
      new GetInvoicePaymentLinkMetaTransformer(),
    );
  }
}
