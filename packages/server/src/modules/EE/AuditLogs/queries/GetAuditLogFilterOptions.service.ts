import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AuditLog } from '../models/AuditLog.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

export interface AuditLogFilterOption {
  key: string;
  label: string;
}

export interface AuditLogFilterOptions {
  subjects: AuditLogFilterOption[];
  actions: AuditLogFilterOption[];
}

@Injectable()
export class GetAuditLogFilterOptionsService {
  constructor(
    @Inject(AuditLog.name)
    private readonly auditLogModel: TenantModelProxy<typeof AuditLog>,
    private readonly i18n: I18nService,
  ) {}

  async getFilterOptions(): Promise<AuditLogFilterOptions> {
    const subjectRows = await this.auditLogModel()
      .query()
      .select('subject')
      .groupBy('subject')
      .orderBy('subject', 'asc');

    const actionRows = await this.auditLogModel()
      .query()
      .select('action')
      .groupBy('action')
      .orderBy('action', 'asc');

    return {
      subjects: subjectRows
        .map((r) => r.subject)
        .filter(Boolean)
        .map((key) => ({
          key,
          label: this.i18n.t(`audit_log.subject.${key}`),
        })),
      actions: actionRows
        .map((r) => r.action)
        .filter(Boolean)
        .map((key) => ({ key, label: this.i18n.t(`audit_log.action.${key}`) })),
    };
  }
}
