import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Customer } from '@/modules/Customers/models/Customer';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { CreateRecurringInvoiceDto } from '../dtos/RecurringInvoice.dto';
import { RecurringInvoiceDTOTransformer } from './RecurringInvoiceDTOTransformer.service';
import { RecurringInvoiceValidators } from './RecurringInvoiceValidators.service';
import {
  ERRORS,
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceStatus,
} from '../RecurringInvoice.types';
import { getFirstOccurrenceOnOrAfter, getTodayDate } from '../utils/recurrence';

@Injectable()
export class CreateRecurringInvoice {
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
   * Creates a new recurring invoice profile.
   */
  public async createRecurringInvoice(
    recurringInvoiceDTO: CreateRecurringInvoiceDto,
  ): Promise<RecurringInvoice> {
    this.validators.validateProfileName(recurringInvoiceDTO.profileName);
    await this.validators.validateInvoiceAutoIncrement();
    this.validators.validateDateRange(
      recurringInvoiceDTO.startDate,
      recurringInvoiceDTO.endDate,
    );

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

    const nextInvoiceDate = getFirstOccurrenceOnOrAfter(
      recurringInvoiceDTO.startDate,
      today,
      recurringInvoiceDTO.frequency,
      recurringInvoiceDTO.repeatInterval || 1,
      recurringInvoiceDTO.endDate,
    );

    if (!nextInvoiceDate) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_END_CONDITION_REACHED);
    }

    const recurringInvoiceObj = await this.transformerDTO.transformDTOToModel(
      customer,
      recurringInvoiceDTO,
      nextInvoiceDate,
      RecurringInvoiceStatus.Active,
    );

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const recurringInvoice = await this.recurringInvoiceModel()
        .query(trx)
        .insertGraph(recurringInvoiceObj);

      // Re-read inside the same transaction to avoid racing the (unawaited)
      // commit in UnitOfWork when the transaction is committed.
      return this.recurringInvoiceModel()
        .query(trx)
        .findById(recurringInvoice.id)
        .withGraphFetched('entries.item')
        .withGraphFetched('customer')
        .throwIfNotFound();
    });
  }
}
