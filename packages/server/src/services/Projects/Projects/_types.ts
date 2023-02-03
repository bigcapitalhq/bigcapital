import {
  ProjectBillableEntriesQuery,
  ProjectBillableEntry,
  ProjectBillableType,
} from '@/interfaces';
import { Knex } from 'knex';

export interface IncreaseInvoicedTaskQueuePayload {
  tenantId: number;
  projectRefId: number;
  projectRefInvoicedAmount: number;
  trx?: Knex.Transaction;
}

export interface ProjectBillableGetter {
  type: ProjectBillableType;
  getter: (
    tenantId: number,
    projectId: number,
    query: ProjectBillableEntriesQuery
  ) => Promise<ProjectBillableEntry[]>;
}
