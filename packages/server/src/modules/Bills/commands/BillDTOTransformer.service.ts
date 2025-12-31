import { Inject, Injectable } from '@nestjs/common';
import { omit, sumBy } from 'lodash';
import * as moment from 'moment';
import * as R from 'ramda';
import * as composeAsync from 'async/compose';
import { formatDateFields } from '@/utils/format-date-fields';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Item } from '@/modules/Items/models/Item';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { ItemEntriesTaxTransactions } from '@/modules/TaxRates/ItemEntriesTaxTransactions.service';
import { Bill } from '../models/Bill';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateBillDto } from '../dtos/Bill.dto';

@Injectable()
export class BillDTOTransformer {
  constructor(
    private branchDTOTransform: BranchTransactionDTOTransformer,
    private warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private taxDTOTransformer: ItemEntriesTaxTransactions,
    private tenancyContext: TenancyContext,

    @Inject(ItemEntry.name)
    private itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(Item.name) private itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Retrieve the bill entries total.
   * @param {IItemEntry[]} entries
   * @returns {number}
   */
  private getBillEntriesTotal(entries: ItemEntry[]): number {
    return sumBy(entries, (e) => this.itemEntryModel().calcAmount(e));
  }

  /**
   * Retrieve the bill landed cost amount.
   * @param {CreateBillDto} billDTO
   * @returns {number}
   */
  private getBillLandedCostAmount(billDTO: CreateBillDto): number {
    const costEntries = billDTO.entries.filter((entry) => entry.landedCost);

    // return this.getBillEntriesTotal(costEntries);

    return 0;
  }

  /**
   * Converts create bill DTO to model.
   * @param {IBillDTO} billDTO
   * @param {IBill} oldBill
   * @returns {IBill}
   */
  public async billDTOToModel(
    billDTO: CreateBillDto,
    vendor: Vendor,
    oldBill?: Bill,
  ): Promise<Bill> {
    const amount = sumBy(billDTO.entries, (e) =>
      this.itemEntryModel().calcAmount(e),
    );
    // Retrieve the landed cost amount from landed cost entries.
    const landedCostAmount = this.getBillLandedCostAmount(billDTO);

    // Retrieve the authorized user.
    const authorizedUser = await this.tenancyContext.getSystemUser();

    // Bill number from DTO or frprom auto-increment.
    const billNumber = billDTO.billNumber || oldBill?.billNumber;

    const initialEntries = billDTO.entries.map((entry) => ({
      referenceType: 'Bill',
      isInclusiveTax: billDTO.isInclusiveTax,
      ...omit(entry, ['amount']),
    }));

    // Process entries sequentially to avoid async compose issues
    const step1 = await this.setBillEntriesDefaultAccounts()(initialEntries);
    const step2 = await this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(step1);
    const asyncEntries = await this.taxDTOTransformer.assocTaxRatesFromTaxIdsToEntries(
      step2,
      billDTO.isInclusiveTax,
    );

    const entries = R.compose(
      // Transform taxRateIds to nested taxes relations for graph insert.
      R.map((entry: any) => {
        if (entry.taxRateIds && entry.taxRateIds.length > 0) {
          const taxes = entry.calculatedTaxes?.map((tax: any, index: number) => ({
            taxRateId: tax.taxRateId,
            taxRate: tax.taxRate,
            taxAmount: tax.taxAmount || 0,
            taxableAmount: tax.taxableAmount || 0,
            order: index,
          })) || [];

          return {
            ...R.omit(['taxRateIds', 'calculatedTaxes', 'totalTaxAmount'], entry),
            taxes,
          };
        }
        return R.omit(['taxRateIds', 'calculatedTaxes', 'totalTaxAmount'], entry);
      }),
      // Remove tax code from entries.
      R.map(R.omit(['taxCode'])),
      // Associate the default index to each item entry line.
      assocItemEntriesDefaultIndex,
    )(asyncEntries);

    const initialDTO = {
      ...formatDateFields(omit(billDTO, ['open', 'entries', 'attachments']), [
        'billDate',
        'dueDate',
      ]),
      amount,
      landedCostAmount,
      currencyCode: vendor.currencyCode,
      exchangeRate: billDTO.exchangeRate || 1,
      billNumber,
      entries,
      // Avoid rewrite the open date in edit mode when already opened.
      ...(billDTO.open &&
        !oldBill?.openedAt && {
          openedAt: moment().toMySqlDateTime(),
        }),
      userId: authorizedUser.id,
    };

    const asyncDto = await composeAsync(
      this.branchDTOTransform.transformDTO<Bill>,
      this.warehouseDTOTransform.transformDTO<Bill>,
    )(initialDTO);

    return R.compose(
      // Associates tax amount withheld to the model.
      this.taxDTOTransformer.assocTaxAmountWithheldFromEntries,
    )(asyncDto) as Bill;
  }

  /**
   * Sets the default cost account to the bill entries.
   */
  private setBillEntriesDefaultAccounts() {
    return async (entries: ItemEntry[]) => {
      const entriesItemsIds = entries.map((e) => e.itemId);
      const items = await this.itemModel()
        .query()
        .whereIn('id', entriesItemsIds);

      return entries.map((entry) => {
        const item = items.find((i) => i.id === entry.itemId);

        return {
          ...entry,
          ...(item.type !== 'inventory' && {
            costAccountId: entry.costAccountId || item.costAccountId,
          }),
        };
      });
    };
  }
}
