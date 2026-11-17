import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { omit } from 'lodash';
import { Customer } from '@/modules/Customers/models/Customer';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { EditRecurringInvoiceDto } from '../dtos/RecurringInvoice.dto';
import { RecurringInvoiceDTOTransformer } from './RecurringInvoiceDTOTransformer.service';
import { RecurringInvoiceValidators } from './RecurringInvoiceValidators.service';
import {
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceStatus,
} from '../RecurringInvoice.types';
import {
  getFirstOccurrenceOnOrAfter,
  getTodayDate,
  isScheduleExhausted,
} from '../utils/recurrence';

@Injectable()
export class EditRecurringInvoice {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly validators: RecurringInvoiceValidators,
    private readonly transformerDTO: RecurringInvoiceDTOTransformer,
    private readonly tenancyContext: TenancyContext,
    private readonly uow: UnitOfWork,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Edits the given recurring invoice profile. Changes apply to future
   * generated invoices only.
   */
  public async editRecurringInvoice(
    recurringInvoiceId: number,
    recurringInvoiceDTO: EditRecurringInvoiceDto,
  ): Promise<RecurringInvoice> {
    this.validators.validateProfileName(recurringInvoiceDTO.profileName);
    await this.validators.validateInvoiceAutoIncrement();
    this.validators.validateDateRange(
      recurringInvoiceDTO.startDate,
      recurringInvoiceDTO.endDate,
    );

    const oldRecurringInvoice = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId)
      .withGraphFetched('entries')
      .withGraphFetched('customer')
      .throwIfNotFound();

    const customer = await this.customerModel()
      .query()
      .findById(recurringInvoiceDTO.customerId)
      .throwIfNotFound();

    this.validators.validateCustomerEmail(
      customer,
      recurringInvoiceDTO.deliveryMode ?? RecurringInvoiceDeliveryMode.Draft,
    );

    await this.itemsEntriesService.validateItemsIdsExistance(
      recurringInvoiceDTO.entries,
    );
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      recurringInvoiceDTO.entries,
    );

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    const scheduleChanged =
      oldRecurringInvoice.startDate !== recurringInvoiceDTO.startDate ||
      oldRecurringInvoice.frequency !== recurringInvoiceDTO.frequency ||
      Number(oldRecurringInvoice.repeatInterval) !==
        Number(recurringInvoiceDTO.repeatInterval || 1);

    const previousStatus = oldRecurringInvoice.status;
    let status = previousStatus;
    let nextInvoiceDate = oldRecurringInvoice.nextInvoiceDate;

    if (previousStatus !== RecurringInvoiceStatus.Paused) {
      if (
        previousStatus === RecurringInvoiceStatus.Completed ||
        scheduleChanged ||
        !nextInvoiceDate ||
        nextInvoiceDate < today
      ) {
        nextInvoiceDate = getFirstOccurrenceOnOrAfter(
          recurringInvoiceDTO.startDate,
          today,
          recurringInvoiceDTO.frequency,
          recurringInvoiceDTO.repeatInterval || 1,
          recurringInvoiceDTO.endDate,
        );
      }

      if (!nextInvoiceDate) {
        status = RecurringInvoiceStatus.Completed;
      } else {
        status = RecurringInvoiceStatus.Active;
      }
    }

    const recurringInvoiceObj = await this.transformerDTO.transformDTOToModel(
      customer,
      recurringInvoiceDTO,
      nextInvoiceDate,
      status,
    );

    // Preserve the creation metadata, template and generation counters on edit.
    recurringInvoiceObj.userId = oldRecurringInvoice.userId;
    recurringInvoiceObj.pdfTemplateId =
      recurringInvoiceDTO.pdfTemplateId ?? oldRecurringInvoice.pdfTemplateId;
    recurringInvoiceObj.branchId =
      recurringInvoiceDTO.branchId ?? oldRecurringInvoice.branchId;
    recurringInvoiceObj.warehouseId =
      recurringInvoiceDTO.warehouseId ?? oldRecurringInvoice.warehouseId;
    recurringInvoiceObj.occurrencesCount = oldRecurringInvoice.occurrencesCount;
    recurringInvoiceObj.lastInvoiceDate = oldRecurringInvoice.lastInvoiceDate;
    recurringInvoiceObj.failureCount = 0;
    recurringInvoiceObj.lastError = null;

    if (
      status === RecurringInvoiceStatus.Active &&
      isScheduleExhausted({
        endDate: recurringInvoiceDTO.endDate,
        maxOccurrences: recurringInvoiceDTO.maxOccurrences,
        occurrencesCount: recurringInvoiceObj.occurrencesCount,
        nextInvoiceDate,
      })
    ) {
      status = RecurringInvoiceStatus.Completed;
      recurringInvoiceObj.status = status;
      recurringInvoiceObj.nextInvoiceDate = null;
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const { entries, ...recurringInvoiceFields } = recurringInvoiceObj;

      await this.recurringInvoiceModel()
        .query(trx)
        .patchAndFetchById(
          recurringInvoiceId,
          omit(recurringInvoiceFields, ['id']),
        );

      await oldRecurringInvoice.$relatedQuery('entries', trx).delete();

      if (entries.length) {
        await oldRecurringInvoice.$relatedQuery('entries', trx).insert(entries);
      }

      // Re-read inside the same transaction to avoid racing the (unawaited)
      // commit in UnitOfWork when the transaction is committed.
      return this.recurringInvoiceModel()
        .query(trx)
        .findById(recurringInvoiceId)
        .withGraphFetched('entries.item')
        .withGraphFetched('customer')
        .throwIfNotFound();
    });
  }
}
