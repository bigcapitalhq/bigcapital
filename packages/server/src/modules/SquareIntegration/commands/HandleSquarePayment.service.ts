import { Inject, Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CreateSaleReceipt } from '@/modules/SaleReceipts/commands/CreateSaleReceipt.service';
import { CreateManualJournalService } from '@/modules/ManualJournals/commands/CreateManualJournal.service';
import { CreateSaleReceiptDto } from '@/modules/SaleReceipts/dtos/SaleReceipt.dto';
import { CreateManualJournalDto } from '@/modules/ManualJournals/dtos/ManualJournal.dto';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareItemMapping } from '../models/SquareItemMapping.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { ResolveBigcapitalCustomer } from './ResolveBigcapitalCustomer.service';
import { SquareDocumentLinks } from './SquareDocumentLinks.service';
import { centsToAmount } from '../utils/SquareMoney';

export type HandleSquarePaymentResult =
  | { handled: false; reason: string }
  | {
      handled: true;
      saleReceiptId: number;
      tipJournalId: number | null;
      isNew: boolean;
    };

/**
 * Phase-2 payment handler. Turns a Square `payment.created` /
 * `payment.updated` event into a Bigcapital SaleReceipt (one line per
 * Square Order line item, mapped to user-configured items where
 * available, falling back to the auto-created "Square Sales" item).
 *
 * Tip dollars do NOT appear on the SaleReceipt: Bigcapital validates
 * an item's sell account is income-class, but tips_liability is a
 * liability. Tips post via a supplemental ManualJournal entry:
 *
 *   Debit  Clearing (clearingAccountId)        tip_money
 *   Credit Tips Payable (tipsLiabilityAccountId) tip_money
 *
 * The SaleReceipt and the tip journal are linked to the Square payment
 * via square_document_links so duplicate events (Square emits both
 * `payment.created` and `payment.updated` for the same payment) are
 * idempotent.
 *
 * v1 assumptions / known limitations:
 *   - USD only. Other currencies will be converted as if cents=2-decimal.
 *   - Tax handling: ignored. Square's per-line tax computed amounts are
 *     not posted; admins can address via tax codes on the mapped item
 *     in a future iteration.
 *   - Discounts: each line uses base_price_money * quantity. Order-level
 *     discounts not yet allocated back to lines.
 *   - Payments without an order_id (direct charges) post a single-line
 *     receipt with the gross-minus-tip amount on the Square Sales item.
 *   - Only acts on payments with status COMPLETED.
 */
@Injectable()
export class HandleSquarePayment {
  private readonly logger = new Logger(HandleSquarePayment.name);

  constructor(
    private readonly uow: UnitOfWork,
    private readonly squareApi: SquareApiClient,
    private readonly resolveCustomer: ResolveBigcapitalCustomer,
    private readonly documentLinks: SquareDocumentLinks,
    private readonly createSaleReceipt: CreateSaleReceipt,
    private readonly createManualJournal: CreateManualJournalService,

    @Inject(SquareItemMapping.name)
    private readonly itemMappingModel: TenantModelProxy<typeof SquareItemMapping>,
  ) {}

  public async handle(params: {
    connection: SquareConnection;
    payment: any;
    eventLogId: number;
  }): Promise<HandleSquarePaymentResult> {
    const { connection, payment, eventLogId } = params;

    // Reject obviously incomplete payloads early.
    if (!payment?.id) {
      return { handled: false, reason: 'payment_missing_id' };
    }
    if (payment.status !== 'COMPLETED') {
      return {
        handled: false,
        reason: `skipped_status_${payment.status ?? 'unknown'}`,
      };
    }
    this.assertConnectionIsActivated(connection);

    // Fetch the related order for line-item detail. If the payment has
    // no order_id, fall back to a single-line receipt below.
    const order = payment.orderId
      ? await this.fetchOrder(connection, payment.orderId)
      : null;

    return this.uow.withTransaction(async (trx) => {
      const customerId = await this.resolveCustomer.resolve({
        connection,
        squareCustomerId: payment.customerId ?? order?.customerId ?? null,
        trx,
      });

      const tipAmount = centsToAmount(payment.tipMoney);
      const lineItems: any[] = order?.lineItems ?? [];

      const entries = await this.buildEntries({
        connection,
        lineItems,
        // Fallback when there are no line items (direct charge): post a
        // single line for the non-tip portion of amountMoney.
        fallbackAmount: centsToAmount(payment.amountMoney) - tipAmount,
        trx,
      });
      if (entries.length === 0) {
        return { handled: false, reason: 'no_billable_amount' };
      }

      // 1. SaleReceipt for the subtotal (no tip).
      const receiptResult = await this.documentLinks.ensureLink({
        lookup: {
          connectionId: connection.id,
          squareObjectType: 'payment',
          squareObjectId: payment.id,
        },
        bigcapitalDocumentType: 'sale_receipt',
        sourceEventLogId: eventLogId,
        create: async (innerTrx) => {
          const dto = this.buildReceiptDto({
            connection,
            payment,
            customerId,
            entries,
          });
          return this.createSaleReceipt.createSaleReceipt(dto, innerTrx);
        },
        trx,
      });

      // 2. Supplemental ManualJournal for the tip portion (if any).
      let tipJournalId: number | null = null;
      if (tipAmount > 0) {
        const tipResult = await this.documentLinks.ensureLink({
          lookup: {
            connectionId: connection.id,
            squareObjectType: 'payment_tip',
            squareObjectId: payment.id,
          },
          bigcapitalDocumentType: 'manual_journal',
          sourceEventLogId: eventLogId,
          create: async (innerTrx) => {
            const dto = this.buildTipJournalDto({
              connection,
              payment,
              tipAmount,
            });
            return this.createManualJournal.makeJournalEntries(dto, innerTrx);
          },
          trx,
        });
        tipJournalId = tipResult.documentId;
      }

      return {
        handled: true,
        saleReceiptId: receiptResult.documentId,
        tipJournalId,
        isNew: !receiptResult.existed,
      };
    });
  }

  private assertConnectionIsActivated(c: SquareConnection): void {
    const missing: string[] = [];
    if (!c.clearingAccountId) missing.push('clearingAccountId');
    if (!c.defaultSalesAccountId) missing.push('defaultSalesAccountId');
    if (!c.walkInCustomerId) missing.push('walkInCustomerId');
    if (!c.tipsLiabilityAccountId) missing.push('tipsLiabilityAccountId');
    if (!c.squareSalesItemId) missing.push('squareSalesItemId');
    if (missing.length) {
      throw new Error(
        `Square connection ${c.id} is missing wizard configuration: ${missing.join(', ')}.`,
      );
    }
  }

  private async fetchOrder(
    connection: SquareConnection,
    orderId: string,
  ): Promise<any | null> {
    const res = await this.squareApi.request(connection, {
      method: 'GET',
      url: `/v2/orders/${encodeURIComponent(orderId)}`,
    });
    if (res.status !== 200) {
      this.logger.warn(
        `Failed to fetch Square order ${orderId}: ${res.status} ${JSON.stringify(res.data)}`,
      );
      return null;
    }
    return res.data?.order ?? null;
  }

  private async buildEntries(params: {
    connection: SquareConnection;
    lineItems: any[];
    fallbackAmount: number;
    trx?: Knex.Transaction;
  }): Promise<any[]> {
    const { connection, lineItems, fallbackAmount, trx } = params;

    if (lineItems.length === 0) {
      if (fallbackAmount <= 0) return [];
      return [
        {
          index: 0,
          itemId: connection.squareSalesItemId,
          quantity: 1,
          rate: fallbackAmount,
          description: 'Square POS sale (no order detail)',
        },
      ];
    }

    // Resolve any mapped items in one query keyed by Square catalog object id.
    const catalogIds = lineItems
      .map((l) => l.catalogObjectId)
      .filter((id): id is string => !!id);
    const mappings = catalogIds.length
      ? await this.itemMappingModel()
          .query(trx)
          .where({ connectionId: connection.id })
          .whereIn('squareCatalogObjectId', catalogIds)
      : [];
    const byCatalogId = new Map<string, number>();
    for (const m of mappings) {
      if (m.itemId) byCatalogId.set(m.squareCatalogObjectId, m.itemId);
    }

    return lineItems
      .map((line, index) => {
        const quantity = parseFloat(line.quantity ?? '1') || 1;
        const linePrice = centsToAmount(
          line.basePriceMoney ?? line.totalMoney ?? line.grossSalesMoney,
        );
        if (linePrice <= 0) return null;

        const mappedItemId = line.catalogObjectId
          ? byCatalogId.get(line.catalogObjectId)
          : undefined;

        return {
          index,
          itemId: mappedItemId ?? connection.squareSalesItemId,
          quantity,
          rate: linePrice,
          description: line.name ?? 'Square line item',
        };
      })
      .filter((e): e is any => e !== null);
  }

  private buildReceiptDto(params: {
    connection: SquareConnection;
    payment: any;
    customerId: number;
    entries: any[];
  }): CreateSaleReceiptDto {
    const { connection, payment, customerId, entries } = params;
    const receiptDate = payment.createdAt
      ? new Date(payment.createdAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    return {
      customerId,
      depositAccountId: connection.clearingAccountId as number,
      receiptDate: receiptDate as any,
      receiptNumber: `SQ-${payment.id}`,
      referenceNo: payment.orderId ?? undefined,
      closed: true,
      entries,
      receiptMessage: undefined,
      statement: `Square payment ${payment.id}`,
    } as CreateSaleReceiptDto;
  }

  private buildTipJournalDto(params: {
    connection: SquareConnection;
    payment: any;
    tipAmount: number;
  }): CreateManualJournalDto {
    const { connection, payment, tipAmount } = params;
    const journalDate = payment.createdAt
      ? new Date(payment.createdAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    return {
      date: journalDate as any,
      currencyCode: 'USD',
      reference: payment.id,
      description: `Square tip on payment ${payment.id}`,
      publish: true,
      entries: [
        {
          index: 0,
          accountId: connection.clearingAccountId as number,
          debit: tipAmount,
        },
        {
          index: 1,
          accountId: connection.tipsLiabilityAccountId as number,
          credit: tipAmount,
        },
      ],
    } as CreateManualJournalDto;
  }
}
