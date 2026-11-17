import { Inject, Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { Customer } from '@/modules/Customers/models/Customer';
import { TaxRateModel } from '@/modules/TaxRates/models/TaxRate.model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { WarehousesSettings } from '@/modules/Warehouses/WarehousesSettings';
import { BranchesSettingsService } from '@/modules/Branches/BranchesSettings';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { CommandRecurringInvoiceDto } from '../dtos/RecurringInvoice.dto';
import {
  RECURRING_INVOICE_REFERENCE_TYPE,
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceStatus,
} from '../RecurringInvoice.types';

@Injectable()
export class RecurringInvoiceDTOTransformer {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly warehousesSettings: WarehousesSettings,
    private readonly branchesSettings: BranchesSettingsService,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: TenantModelProxy<typeof TaxRateModel>,

    @Inject(Warehouse.name)
    private readonly warehouseModel: TenantModelProxy<typeof Warehouse>,

    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Transforms the create/edit DTO into a recurring invoice model object.
   */
  public async transformDTOToModel(
    customer: Customer,
    recurringInvoiceDTO: CommandRecurringInvoiceDto,
    nextInvoiceDate: string | null,
    status: RecurringInvoiceStatus = RecurringInvoiceStatus.Active,
  ): Promise<RecurringInvoice> {
    const authorizedUser = await this.tenancyContext.getSystemUser();
    const entries = await this.transformEntries(recurringInvoiceDTO, customer);
    const branchId = await this.resolveBranchId(recurringInvoiceDTO.branchId);
    const warehouseId = await this.resolveWarehouseId(
      recurringInvoiceDTO.warehouseId,
    );

    return {
      customerId: customer.id,
      profileName: recurringInvoiceDTO.profileName,
      referenceNo: recurringInvoiceDTO.referenceNo,
      invoiceMessage: recurringInvoiceDTO.invoiceMessage,
      termsConditions: recurringInvoiceDTO.termsConditions,

      currencyCode: customer.currencyCode,
      exchangeRate: recurringInvoiceDTO.exchangeRate || 1,

      discount: recurringInvoiceDTO.discount,
      discountType: recurringInvoiceDTO.discountType,
      adjustment: recurringInvoiceDTO.adjustment,
      isInclusiveTax: recurringInvoiceDTO.isInclusiveTax ?? false,

      branchId,
      warehouseId,
      pdfTemplateId: recurringInvoiceDTO.pdfTemplateId,
      userId: authorizedUser.id,

      status,
      frequency: recurringInvoiceDTO.frequency,
      repeatInterval: recurringInvoiceDTO.repeatInterval || 1,

      startDate: recurringInvoiceDTO.startDate,
      endDate: recurringInvoiceDTO.endDate ?? null,
      maxOccurrences: recurringInvoiceDTO.maxOccurrences ?? null,
      occurrencesCount: 0,
      nextInvoiceDate,
      lastInvoiceDate: null,
      dueDays: recurringInvoiceDTO.dueDays ?? 0,

      deliveryMode:
        recurringInvoiceDTO.deliveryMode ?? RecurringInvoiceDeliveryMode.Draft,
      emailSubject: recurringInvoiceDTO.emailSubject ?? null,
      emailMessage: recurringInvoiceDTO.emailMessage ?? null,
      emailCc: recurringInvoiceDTO.emailCc ?? null,
      emailBcc: recurringInvoiceDTO.emailBcc ?? null,
      attachInvoice: recurringInvoiceDTO.attachInvoice ?? true,

      failureCount: 0,
      lastError: null,

      entries,
    } as RecurringInvoice;
  }

  /**
   * Resolves the profile branch, defaulting to the primary branch when the
   * multi-branch feature is enabled.
   */
  private async resolveBranchId(
    branchId?: number,
  ): Promise<number | undefined> {
    if (branchId) {
      return branchId;
    }
    const isBranchesActive =
      await this.branchesSettings.isMultiBranchesActive();

    if (!isBranchesActive) {
      return undefined;
    }
    const primaryBranch = await this.branchModel()
      .query()
      .modify('isPrimary')
      .first();
    const branch =
      primaryBranch ??
      (await this.branchModel().query().orderBy('id', 'ASC').first());

    return branch?.id;
  }

  /**
   * Resolves the profile warehouse, defaulting to the primary warehouse when
   * the multi-warehouse feature is enabled.
   */
  private async resolveWarehouseId(
    warehouseId?: number,
  ): Promise<number | undefined> {
    if (warehouseId) {
      return warehouseId;
    }
    const isWarehousesActive =
      await this.warehousesSettings.isMultiWarehousesActive();

    if (!isWarehousesActive) {
      return undefined;
    }
    const primaryWarehouse = await this.warehouseModel()
      .query()
      .modify('isPrimary')
      .first();
    const warehouse =
      primaryWarehouse ??
      (await this.warehouseModel().query().orderBy('id', 'ASC').first());

    return warehouse?.id;
  }

  /**
   * Builds item entries for the recurring profile.
   */
  private async transformEntries(
    recurringInvoiceDTO: CommandRecurringInvoiceDto,
    _customer: Customer,
  ): Promise<ItemEntry[]> {
    const taxRateIds = recurringInvoiceDTO.entries
      .map((entry) => entry.taxRateId)
      .filter((taxRateId) => !!taxRateId);
    const taxCodes = recurringInvoiceDTO.entries
      .map((entry) => entry.taxCode)
      .filter((taxCode) => !!taxCode);

    const taxRatesByIds = taxRateIds.length
      ? await this.taxRateModel().query().whereIn('id', taxRateIds)
      : [];
    const taxRatesByCodes = taxCodes.length
      ? await this.taxRateModel().query().whereIn('code', taxCodes)
      : [];
    const taxRatesIdMap = keyBy(taxRatesByIds, 'id');
    const taxRatesCodeMap = keyBy(taxRatesByCodes, 'code');

    return recurringInvoiceDTO.entries.map((entry, index) => {
      const taxRate =
        taxRatesIdMap[entry.taxRateId] ??
        (entry.taxCode ? taxRatesCodeMap[entry.taxCode] : undefined);

      return {
        referenceType: RECURRING_INVOICE_REFERENCE_TYPE,
        index: entry.index ?? index,
        itemId: entry.itemId,
        description: entry.description,
        quantity: entry.quantity,
        rate: entry.rate,
        discount: entry.discount,
        discountType: entry.discountType,
        taxRateId: entry.taxRateId ?? taxRate?.id,
        taxRate: taxRate?.rate,
        isInclusiveTax: recurringInvoiceDTO.isInclusiveTax,
        warehouseId: entry.warehouseId ?? recurringInvoiceDTO.warehouseId,
        sellAccountId: entry.sellAccountId,
        costAccountId: entry.costAccountId,
      } as unknown as ItemEntry;
    });
  }
}
