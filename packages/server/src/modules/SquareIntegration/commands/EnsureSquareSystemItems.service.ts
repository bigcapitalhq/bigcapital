import { Inject, Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateItemService } from '@/modules/Items/CreateItem.service';
import { Item } from '@/modules/Items/models/Item';
import { SquareConnection } from '../models/SquareConnection.model';

const SQUARE_SALES_ITEM_NAME = 'Square Sales';

/**
 * Auto-creates the Bigcapital items the Phase-2 payment handler needs as
 * fallbacks for unmapped Square line items. Idempotent: if the connection
 * row already has `squareSalesItemId` set, nothing happens.
 *
 * Tip dollars do NOT get an item — Bigcapital validates that an item's
 * sell account is income-class, and tips_liability_account_id is a
 * liability. The payment handler instead posts a separate ManualJournal
 * to move tip dollars from clearing to tips_liability.
 *
 * Called from UpdateSquareConnectionSettings.update at the moment the
 * wizard flips the connection from `pending` to `active`.
 */
@Injectable()
export class EnsureSquareSystemItems {
  private readonly logger = new Logger(EnsureSquareSystemItems.name);

  constructor(
    private readonly createItemService: CreateItemService,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Ensures the "Square Sales" fallback item exists for the given
   * connection. Returns the item id (existing or newly-created).
   */
  public async ensure(
    connection: SquareConnection,
    trx?: Knex.Transaction,
  ): Promise<{ squareSalesItemId: number; created: boolean }> {
    if (connection.squareSalesItemId) {
      return { squareSalesItemId: connection.squareSalesItemId, created: false };
    }
    if (!connection.defaultSalesAccountId) {
      throw new Error(
        'Cannot create Square system items: defaultSalesAccountId is not set on the connection.',
      );
    }

    // Check if an item with the system name already exists (e.g. from a
    // prior activation that crashed mid-write). Reuse it rather than
    // tripping the unique-name validator.
    const existing = await this.itemModel()
      .query(trx)
      .findOne({ name: SQUARE_SALES_ITEM_NAME });

    let itemId: number;
    if (existing) {
      itemId = existing.id;
    } else {
      // CreateItemService.createItem returns the new item id (number),
      // not the model. Item descriptors are minimal — the payment
      // handler overrides per-line description with the Square line name.
      itemId = await this.createItemService.createItem(
        {
          name: SQUARE_SALES_ITEM_NAME,
          type: 'service',
          sellable: true,
          purchasable: false,
          sellPrice: 0,
          sellAccountId: connection.defaultSalesAccountId,
          sellDescription: 'Square POS line item (auto-categorized)',
        } as any,
        trx,
      );
      this.logger.log(
        `Created Square Sales fallback item id=${itemId} for connection ${connection.id}`,
      );
    }

    await this.connectionModel()
      .query(trx)
      .patchAndFetchById(connection.id, { squareSalesItemId: itemId });

    return { squareSalesItemId: itemId, created: !existing };
  }
}
