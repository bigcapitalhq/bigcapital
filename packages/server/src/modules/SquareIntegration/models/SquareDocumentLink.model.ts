import { BaseModel } from '@/models/Model';

export type SquareObjectType = 'payment' | 'refund' | 'payout' | 'invoice';
export type BigcapitalDocumentType =
  | 'sale_receipt'
  | 'credit_note'
  | 'manual_journal'
  | 'sale_invoice'
  | 'payment_received';

/**
 * Per-tenant link between a Square object (payment/refund/payout/invoice)
 * and the Bigcapital document a Phase-2 handler created from it. The
 * `(connection_id, square_object_type, square_object_id)` unique key
 * enforces idempotency — handlers consult this row before creating, and
 * insert atomically afterward.
 */
export class SquareDocumentLink extends BaseModel {
  public id!: number;
  public connectionId!: number;
  public squareObjectType!: SquareObjectType;
  public squareObjectId!: string;
  public bigcapitalDocumentType!: BigcapitalDocumentType;
  public bigcapitalDocumentId!: number;
  public sourceEventLogId!: number | null;

  static get tableName() {
    return 'square_document_links';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
