import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { RecurringInvoiceValidators } from './RecurringInvoiceValidators.service';
import { ERRORS, RecurringInvoiceStatus } from '../RecurringInvoice.types';
import {
  addOccurrence,
  getFirstOccurrenceOnOrAfter,
  getTodayDate,
} from '../utils/recurrence';

@Injectable()
export class ResumeRecurringInvoice {
  constructor(
    private readonly validators: RecurringInvoiceValidators,
    private readonly tenancyContext: TenancyContext,
    private readonly uow: UnitOfWork,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Resumes a paused recurring invoice profile. Missed occurrences while
   * paused are skipped.
   */
  public async resumeRecurringInvoice(
    recurringInvoiceId: number,
  ): Promise<RecurringInvoice> {
    const recurringInvoice = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId)
      .throwIfNotFound();

    this.validators.validateCanResume(recurringInvoice);

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    let nextInvoiceDate = getFirstOccurrenceOnOrAfter(
      recurringInvoice.startDate,
      today,
      recurringInvoice.frequency,
      recurringInvoice.repeatInterval,
      recurringInvoice.endDate,
    );

    if (!nextInvoiceDate) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_END_CONDITION_REACHED);
    }

    // Skip dates that already have generated invoices.
    for (let index = 0; index < 10000; index++) {
      const existingInvoice = await this.saleInvoiceModel().query().findOne({
        recurringInvoiceId,
        recurringInvoiceDate: nextInvoiceDate,
      });

      if (!existingInvoice) {
        break;
      }
      nextInvoiceDate = addOccurrence(
        nextInvoiceDate,
        recurringInvoice.startDate,
        recurringInvoice.frequency,
        recurringInvoice.repeatInterval,
      );

      if (
        recurringInvoice.endDate &&
        nextInvoiceDate > recurringInvoice.endDate
      ) {
        throw new ServiceError(ERRORS.RECURRING_INVOICE_END_CONDITION_REACHED);
      }
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      return this.recurringInvoiceModel()
        .query(trx)
        .patchAndFetchById(recurringInvoiceId, {
          status: RecurringInvoiceStatus.Active,
          nextInvoiceDate,
          failureCount: 0,
          lastError: null,
        });
    });
  }
}
