import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareEventLog } from '../models/SquareEventLog.model';

@Injectable()
export class GetSquareEventLog {
  constructor(
    @Inject(SquareEventLog.name)
    private readonly eventLogModel: TenantModelProxy<typeof SquareEventLog>,
  ) {}

  public async list(
    connectionId: number,
    params: {
      status?: string;
      eventType?: string;
      limit?: number;
      cursor?: number;
    } = {},
  ) {
    const { status, eventType, limit = 50, cursor } = params;
    const rows = await this.eventLogModel()
      .query()
      .where('connectionId', connectionId)
      .modify((q) => {
        if (status) q.where('status', status);
        if (eventType) q.where('eventType', eventType);
        if (cursor) q.where('id', '<', cursor);
      })
      .orderBy('id', 'DESC')
      .limit(Math.min(limit, 200));

    const nextCursor = rows.length === limit ? rows[rows.length - 1].id : null;
    return { events: rows, nextCursor };
  }
}
