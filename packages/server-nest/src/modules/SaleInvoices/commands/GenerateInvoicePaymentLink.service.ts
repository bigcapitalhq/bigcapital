import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { GeneratePaymentLinkTransformer } from './GeneratePaymentLink.transformer';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { events } from '@/common/events/events';
import { PaymentLink } from '@/modules/PaymentLinks/models/PaymentLink';
import { SaleInvoice } from '../models/SaleInvoice';


@Injectable()
export class GenerateShareLink {
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private transformer: TransformerInjectable,
    @Inject(SaleInvoice.name) private saleInvoiceModel: typeof SaleInvoice,
    @Inject(PaymentLink.name) private paymentLinkModel: typeof PaymentLink,
  ) {}

  /**
   * Generates private or public payment link for the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {string} publicity - Public or private.
   * @param {string} expiryTime  - Expiry time.
   */
  async generatePaymentLink(
    saleInvoiceId: number,
    publicity: string = 'private',
    expiryTime: string = ''
  ) {
    const foundInvoice = await this.saleInvoiceModel.query()
      .findById(saleInvoiceId)
      .throwIfNotFound();

    // Generate unique uuid for sharable link.
    const linkId = uuidv4() as string;

    const commonEventPayload = {
      saleInvoiceId,
      publicity,
      expiryTime,
    };
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPublicSharableLinkGenerating` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onPublicLinkGenerating,
        { ...commonEventPayload, trx }
      );
      const paymentLink = await this.paymentLinkModel.query().insert({
        linkId,
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
        paymentLink,
        new GeneratePaymentLinkTransformer()
      );
    });
  }
}
