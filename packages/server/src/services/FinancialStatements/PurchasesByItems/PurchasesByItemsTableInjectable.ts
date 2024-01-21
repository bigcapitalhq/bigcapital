import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsTable,
} from '@/interfaces/PurchasesByItemsSheet';
import { Service } from 'typedi';

@Service()
export class PurchasesByItemsTableInjectable {
  table(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsTable> {}
}
