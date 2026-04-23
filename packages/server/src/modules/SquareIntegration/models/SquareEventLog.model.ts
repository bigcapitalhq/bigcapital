import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export type SquareEventStatus =
  | 'received'
  | 'processing'
  | 'done'
  | 'failed'
  | 'skipped_duplicate';

export type SquareEventSource = 'webhook' | 'backfill' | 'manual_reprocess';

export class SquareEventLog extends BaseModel {
  public connectionId!: number;
  public squareEventId!: string;
  public eventType!: string;
  public source!: SquareEventSource;
  public payload!: any;
  public status!: SquareEventStatus;
  public errorText!: string | null;
  public createdReferenceType!: string | null;
  public createdReferenceId!: number | null;
  public receivedAt!: Date;
  public processedAt!: Date | null;

  static get tableName() {
    return 'square_event_log';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * MySQL stores JSON columns as strings through knex; parse on read so
   * handlers can work with objects directly.
   */
  $parseDatabaseJson(json: any) {
    const parsed = super.$parseDatabaseJson(json);
    if (typeof parsed.payload === 'string') {
      try {
        parsed.payload = JSON.parse(parsed.payload);
      } catch {
        /* leave as-is if not valid JSON */
      }
    }
    return parsed;
  }

  static get relationMappings() {
    const {
      SquareConnection,
    } = require('./SquareConnection.model');
    return {
      connection: {
        relation: Model.BelongsToOneRelation,
        modelClass: SquareConnection,
        join: {
          from: 'square_event_log.connectionId',
          to: 'square_connections.id',
        },
      },
    };
  }
}
