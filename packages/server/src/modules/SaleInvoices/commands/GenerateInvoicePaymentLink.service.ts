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
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateShareLink {
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private transformer: TransformerInjectable,
    private tenancyContext: TenancyContext,
    private configService: ConfigService,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(PaymentLink.name)
    private paymentLinkModel: typeof PaymentLink,
  ) { }

  /**
   * Generates private or public payment link for the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {string} publicity - Public or private.
   * @param {string} expiryTime  - Expiry time.
   */
  async generatePaymentLink(
    saleInvoiceId: number,
    publicity: string = 'private',
    expiryTime: string = '',
  ) {
    const foundInvoice = await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .throwIfNotFound();
    const tenant = await this.tenancyContext.getTenant();

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
        { ...commonEventPayload, trx },
      );
      const paymentLink = await this.paymentLinkModel.query().insert({
        linkId,
        publicity,
        resourceId: foundInvoice.id,
        resourceType: 'SaleInvoice',
        tenantId: tenant.id,
      });
      // Triggers `onPublicSharableLinkGenerated` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onPublicLinkGenerated,
        {
          ...commonEventPayload,
          paymentLink,
          trx,
        },
      );
      return await this.generatePaymentLinkFromModel(paymentLink);
    });
  }

  /**
   * Generates a payment link (with URL) for the given payment link model.
   */
  generatePaymentLinkFromModel(paymentLink: PaymentLink) {
    return this.transformer.transform(
      paymentLink,
      new GeneratePaymentLinkTransformer(),
      {
        baseUrl: this.configService.get('app.baseUrl'),
      },
    );
  }
}
