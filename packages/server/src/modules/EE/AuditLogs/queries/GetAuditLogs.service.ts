import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { AuditLog } from '../models/AuditLog.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetAuditLogsQueryDto } from '../dtos/GetAuditLogsQuery.dto';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetAuditLogListTransformer } from '@/modules/AuditLogs/queries/GetAuditLogList.transformer';

export interface AuditLogListItem {
  id: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  subject: string;
  subjectId: number | null;
  metadata: Record<string, unknown> | null;
  summary: string;
  ip: string | null;
  createdAt: string;
  createdAtFormatted: string;
}

@Injectable()
export class GetAuditLogsService {
  constructor(
    @Inject(AuditLog.name)
    private readonly auditLogModel: TenantModelProxy<typeof AuditLog>,
    private readonly transformer: TransformerInjectable,
  ) {}

  async getAuditLogs(query: GetAuditLogsQueryDto): Promise<{
    data: AuditLogListItem[];
    pagination: { total: number; page: number; pageSize: number };
  }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const pageIndex = Math.max(0, page - 1);

    let q = this.auditLogModel()
      .query()
      .withGraphFetched('tenantUser')
      .orderBy('createdAt', 'desc');

    if (query.subject?.length) {
      q = q.whereIn('subject', query.subject);
    }
    if (query.action?.length) {
      q = q.whereIn('action', query.action);
    }
    if (query.userId != null) {
      q = q.where('userId', query.userId);
    }
    if (query.from) {
      const from = moment(query.from).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      q = q.where('createdAt', '>=', from);
    }
    if (query.to) {
      const to = moment(query.to).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      q = q.where('createdAt', '<=', to);
    }

    const result = await q.page(pageIndex, pageSize);

    const data = (await this.transformer.transform(
      result.results,
      new GetAuditLogListTransformer(),
    )) as AuditLogListItem[];

    return {
      data,
      pagination: {
        total: result.total,
        page,
        pageSize,
      },
    };
  }
}
