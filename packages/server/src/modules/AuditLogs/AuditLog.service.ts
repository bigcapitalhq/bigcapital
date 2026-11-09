import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Knex } from 'knex';
import * as moment from 'moment';
import '@/utils/moment-mysql';
import { AuditLog } from './models/AuditLog.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';

const METADATA_JSON_MAX = 8000;

export interface RecordAuditLogParams {
  /** When set, the row is written in the same DB transaction as the business change. */
  trx?: Knex.Transaction;
  action: string;
  subject: string;
  subjectId?: number | null;
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class AuditLogService {
  constructor(
    private readonly cls: ClsService,
    @Inject(AuditLog.name)
    private readonly auditLogModel: TenantModelProxy<typeof AuditLog>,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  /**
   * Persists one audit row. Prefer always passing `trx` from domain event payloads so the
   * audit row rolls back with failed business transactions. If `trx` is omitted, the insert
   * runs on a separate connection/transaction (only use after the business change committed).
   */
  async record(params: RecordAuditLogParams): Promise<void> {
    const userId = this.cls.get<number>('userId') ?? null;
    const ip = (this.cls.get<string>('ip') as string) ?? null;
    const executor = params.trx ?? this.tenantKnex();
    const metadata = this.normalizeMetadata(params.metadata);

    await this.auditLogModel()
      .query(executor)
      .insert({
        userId,
        action: params.action,
        subject: params.subject,
        subjectId: params.subjectId ?? null,
        metadata,
        ip,
        // MySQL DATETIME expects `YYYY-MM-DD HH:mm:ss`, not ISO-8601 with `T`/`Z`.
        createdAt: moment().toMySqlDateTime(),
      });
  }

  private normalizeMetadata(
    metadata: Record<string, unknown> | null | undefined,
  ): Record<string, unknown> | null {
    if (metadata == null) return null;
    try {
      const s = JSON.stringify(metadata);
      if (s.length <= METADATA_JSON_MAX) return metadata;
      return {
        _truncated: true,
        summary: s.slice(0, METADATA_JSON_MAX),
      };
    } catch {
      return { _error: 'metadata_not_serializable' };
    }
  }
}
