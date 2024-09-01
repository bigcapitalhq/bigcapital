import { omit, sumBy } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import composeAsync from 'async/compose';
import { assocDepthLevelToObjectTree, formatDateFields } from 'utils';
import {
  IBillDTO,
  IBill,
  ISystemUser,
  IVendor,
  IItemEntry,
} from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ItemEntriesTaxTransactions } from '@/services/TaxRates/ItemEntriesTaxTransactions';
import { assocItemEntriesDefaultIndex } from '@/services/Items/utils';

@Service()
export class BillDTOTransformer {
  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private taxDTOTransformer: ItemEntriesTaxTransactions;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve the bill entries total.
   * @param {IItemEntry[]} entries
   * @returns {number}
   */
  private getBillEntriesTotal(tenantId: number, entries: IItemEntry[]): number {
    const { ItemEntry } = this.tenancy.models(tenantId);

    return sumBy(entries, (e) => ItemEntry.calcAmount(e));
  }

  /**
   * Retrieve the bill landed cost amount.
   * @param {IBillDTO} billDTO
   * @returns {number}
   */
  private getBillLandedCostAmount(tenantId: number, billDTO: IBillDTO): number {
    const costEntries = billDTO.entries.filter((entry) => entry.landedCost);

    return this.getBillEntriesTotal(tenantId, costEntries);
  }

  /**
   * Converts create bill DTO to model.
   * @param {number} tenantId
   * @param {IBillDTO} billDTO
   * @param {IBill} oldBill
   * @returns {IBill}
   */
  public async billDTOToModel(
    tenantId: number,
    billDTO: IBillDTO,
    vendor: IVendor,
    authorizedUser: ISystemUser,
    oldBill?: IBill
  ) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(billDTO.entries, (e) => ItemEntry.calcAmount(e));

    // Retrieve the landed cost amount from landed cost entries.
    const landedCostAmount = this.getBillLandedCostAmount(tenantId, billDTO);

    // Bill number from DTO or from auto-increment.
    const billNumber = billDTO.billNumber || oldBill?.billNumber;

    const initialEntries = billDTO.entries.map((entry) => ({
      referenceType: 'Bill',
      isInclusiveTax: billDTO.isInclusiveTax,
      ...omit(entry, ['amount']),
    }));
    const asyncEntries = await composeAsync(
      // Associate tax rate from tax id to entries.
      this.taxDTOTransformer.assocTaxRateFromTaxIdToEntries(tenantId),
      // Associate tax rate id from tax code to entries.
      this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(tenantId),
      // Sets the default cost account to the bill entries.
      this.setBillEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const entries = R.compose(
      // Remove tax code from entries.
      R.map(R.omit(['taxCode'])),
      // Associate the default index to each item entry line.
      assocItemEntriesDefaultIndex
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
    return R.compose(
      // Associates tax amount withheld to the model.
      this.taxDTOTransformer.assocTaxAmountWithheldFromEntries,
      this.branchDTOTransform.transformDTO(tenantId),
      this.warehouseDTOTransform.transformDTO(tenantId)
    )(initialDTO);
  }

  /**
   * Sets the default cost account to the bill entries.
   */
  private setBillEntriesDefaultAccounts(tenantId: number) {
    return async (entries: IItemEntry[]) => {
      const { Item } = this.tenancy.models(tenantId);

      const entriesItemsIds = entries.map((e) => e.itemId);
      const items = await Item.query().whereIn('id', entriesItemsIds);

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
