import * as moment from 'moment';
import { Transformer } from '@/modules/Transformer/Transformer';
import {
  formatAction,
  formatMetadataSummary,
  formatSubject,
} from './GetAuditLogList.transformer.utils';

export class GetAuditLogListTransformer extends Transformer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public includeAttributes = (): string[] => {
    return [
      'id',
      'userId',
      'userName',
      'userEmail',
      'action',
      'subject',
      'subjectId',
      'metadata',
      'summary',
      'ip',
      'createdAt',
      'createdAtFormatted',
    ];
  };

  protected userName = (item: Record<string, any>): string | null => {
    if (!item.tenantUser) return null;
    const u = item.tenantUser as Record<string, string>;
    const firstName = u.firstName || u.first_name || '';
    const lastName = u.lastName || u.last_name || '';
    const fullName = u.fullName || u.full_name || '';
    const name = fullName || `${firstName} ${lastName}`.trim();
    return name || null;
  };

  protected userEmail = (item: Record<string, any>): string | null => {
    if (!item.tenantUser) return null;
    const u = item.tenantUser as Record<string, string>;
    const email =
      u.email || u.emailAddress || u.email_address || '';
    return email || null;
  };

  protected action = (item: Record<string, any>): string => {
    return formatAction(item.action, this.context.i18n.t.bind(this.context.i18n));
  };

  protected subject = (item: Record<string, any>): string => {
    return formatSubject(item.subject, this.context.i18n.t.bind(this.context.i18n));
  };

  protected summary = (item: Record<string, any>): string => {
    return formatMetadataSummary(
      item.metadata,
      item.subject,
      this.context.i18n.t.bind(this.context.i18n),
    );
  };

  protected createdAt = (item: Record<string, any>): string => {
    const raw = item.createdAt;
    if (typeof raw === 'string') return raw;
    return (raw as Date)?.toISOString?.() ?? String(raw);
  };

  protected createdAtFormatted = (item: Record<string, any>): string => {
    const createdAtStr = this.createdAt(item);
    return moment(createdAtStr).format('YYYY-MM-DD HH:mm:ss');
  };
}
