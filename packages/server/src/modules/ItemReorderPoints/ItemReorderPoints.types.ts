import { TenantJobPayload } from '@/interfaces/Tenant';

export interface IItemReorderPointNotificationJobPayload
  extends TenantJobPayload {
  itemIds: number[];
}
