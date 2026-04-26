import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import {
  SquareDocumentLink,
  SquareObjectType,
  BigcapitalDocumentType,
} from '../models/SquareDocumentLink.model';

export interface SquareDocumentLookup {
  connectionId: number;
  squareObjectType: SquareObjectType;
  squareObjectId: string;
}

export interface SquareDocumentInsert extends SquareDocumentLookup {
  bigcapitalDocumentType: BigcapitalDocumentType;
  bigcapitalDocumentId: number;
  sourceEventLogId?: number | null;
}

/**
 * Idempotency helper for Phase-2 Square handlers. The link table has a
 * unique key on (connection_id, square_object_type, square_object_id),
 * so handlers should:
 *
 *   1. Call findLink(...) at the top.
 *   2. If a row is returned, the document already exists — skip and
 *      return the linked Bigcapital document id from the row.
 *   3. Otherwise, create the document inside a UnitOfWork transaction,
 *      then call createLink(...) inside the same transaction. The
 *      unique constraint catches concurrent creations as a duplicate-key
 *      error, which the caller can treat as "another worker won — skip."
 */
@Injectable()
export class SquareDocumentLinks {
  constructor(
    @Inject(SquareDocumentLink.name)
    private readonly linkModel: TenantModelProxy<typeof SquareDocumentLink>,
  ) {}

  public async findLink(
    lookup: SquareDocumentLookup,
    trx?: Knex.Transaction,
  ): Promise<SquareDocumentLink | undefined> {
    return this.linkModel()
      .query(trx)
      .findOne({
        connectionId: lookup.connectionId,
        squareObjectType: lookup.squareObjectType,
        squareObjectId: lookup.squareObjectId,
      });
  }

  public async createLink(
    insert: SquareDocumentInsert,
    trx?: Knex.Transaction,
  ): Promise<SquareDocumentLink> {
    return this.linkModel()
      .query(trx)
      .insert({
        connectionId: insert.connectionId,
        squareObjectType: insert.squareObjectType,
        squareObjectId: insert.squareObjectId,
        bigcapitalDocumentType: insert.bigcapitalDocumentType,
        bigcapitalDocumentId: insert.bigcapitalDocumentId,
        sourceEventLogId: insert.sourceEventLogId ?? null,
      });
  }

  /**
   * Convenience wrapper for the common handler pattern: resolve an
   * existing link by Square id; if none exists, run the creator and
   * persist the resulting link in the same transaction.
   */
  public async ensureLink<T extends { id: number }>(params: {
    lookup: SquareDocumentLookup;
    bigcapitalDocumentType: BigcapitalDocumentType;
    sourceEventLogId?: number | null;
    create: (trx: Knex.Transaction) => Promise<T>;
    trx: Knex.Transaction;
  }): Promise<{ document: T | null; documentId: number; existed: boolean }> {
    const existing = await this.findLink(params.lookup, params.trx);
    if (existing) {
      return {
        document: null,
        documentId: existing.bigcapitalDocumentId,
        existed: true,
      };
    }
    const document = await params.create(params.trx);
    await this.createLink(
      {
        ...params.lookup,
        bigcapitalDocumentType: params.bigcapitalDocumentType,
        bigcapitalDocumentId: document.id,
        sourceEventLogId: params.sourceEventLogId,
      },
      params.trx,
    );
    return { document, documentId: document.id, existed: false };
  }
}
