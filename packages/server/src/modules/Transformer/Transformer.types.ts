import { I18nService } from 'nestjs-i18n';
import { TenantMetadata } from '../System/models/TenantMetadataModel';

export interface TransformerContext {
  organization: TenantMetadata;
  i18n: I18nService;
  exportAls: Record<string, any>;
}
