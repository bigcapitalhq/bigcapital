import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { PaymentLink } from '@/system/models';
import { GeneratePaymentLinkTransformer } from './GeneratePaymentLinkTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GenerateShareLink {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Generates private or public payment link for the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} publicOrPrivate - Public or private.
   * @param {string} expiryTime  - Expiry time.
   */
  async generatePaymentLink(
    tenantId: number,
    saleInvoiceId: number,
    publicity: string = 'private',
    expiryTime: string = ''
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const foundInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .throwIfNotFound();

    // Generate unique uuid for sharable link.
    const linkId = uuidv4() as string;

    const commonEventPayload = {
      tenantId,
      saleInvoiceId,
      publicity,
      expiryTime,
    };
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPublicSharableLinkGenerating` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onPublicLinkGenerating,
        { ...commonEventPayload, trx }
      );
      const paymentLink = await PaymentLink.query().insert({
        linkId,
        tenantId,
        publicity,
        resourceId: foundInvoice.id,
        resourceType: 'SaleInvoice',
      });
      // Triggers `onPublicSharableLinkGenerated` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onPublicLinkGenerated,
        {
          ...commonEventPayload,
          paymentLink,
          trx,
        }
      );
      return this.transformer.transform(
        tenantId,
        paymentLink,
        new GeneratePaymentLinkTransformer()
      );
    });
  }
}
