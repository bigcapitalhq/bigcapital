import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { RecurringInvoiceValidators } from './RecurringInvoiceValidators.service';
import { RecurringInvoiceStatus } from '../RecurringInvoice.types';

@Injectable()
export class PauseRecurringInvoice {
  constructor(
    private readonly validators: RecurringInvoiceValidators,
    private readonly uow: UnitOfWork,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,
  ) {}

  /**
   * Pauses the recurring invoice profile.
   */
  public async pauseRecurringInvoice(
    recurringInvoiceId: number,
  ): Promise<RecurringInvoice> {
    const recurringInvoice = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId)
      .throwIfNotFound();

    this.validators.validateCanPause(recurringInvoice);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      return this.recurringInvoiceModel()
        .query(trx)
        .patchAndFetchById(recurringInvoiceId, {
          status: RecurringInvoiceStatus.Paused,
        });
    });
  }
}
