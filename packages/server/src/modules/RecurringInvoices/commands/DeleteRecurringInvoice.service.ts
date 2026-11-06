import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringInvoice } from '../models/RecurringInvoice';

@Injectable()
export class DeleteRecurringInvoice {
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,
  ) {}

  /**
   * Deletes the recurring invoice profile. Generated invoices are kept and
   * their recurring link is cleared by the database foreign key.
   */
  public async deleteRecurringInvoice(
    recurringInvoiceId: number,
  ): Promise<void> {
    const recurringInvoice = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId)
      .throwIfNotFound();

    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await recurringInvoice.$relatedQuery('entries', trx).delete();
      await recurringInvoice.$query(trx).delete();
    });
  }
}
