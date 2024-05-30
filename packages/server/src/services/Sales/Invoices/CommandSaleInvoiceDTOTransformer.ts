import { Service, Inject } from 'typedi';
import { omit, sumBy } from 'lodash';
import * as R from 'ramda';
import moment from 'moment';
import composeAsync from 'async/compose';
import {
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ICustomer,
  ITenantUser,
} from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { SaleInvoiceIncrement } from './SaleInvoiceIncrement';
import { formatDateFields } from 'utils';
import { ItemEntriesTaxTransactions } from '@/services/TaxRates/ItemEntriesTaxTransactions';
import { ItemEntry } from '@/models';

@Service()
export class CommandSaleInvoiceDTOTransformer {
  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  @Inject()
  private invoiceIncrement: SaleInvoiceIncrement;

  @Inject()
  private taxDTOTransformer: ItemEntriesTaxTransactions;

  /**
   * Transformes the create DTO to invoice object model.
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO - Sale invoice DTO.
   * @param {ISaleInvoice} oldSaleInvoice - Old sale invoice.
   * @return {ISaleInvoice}
   */
  public async transformDTOToModel(
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO,
    authorizedUser: ITenantUser,
    oldSaleInvoice?: ISaleInvoice
  ): Promise<ISaleInvoice> {
    const entriesModels = this.transformDTOEntriesToModels(saleInvoiceDTO);
    const amount = this.getDueBalanceItemEntries(entriesModels);

    // Retreive the next invoice number.
    const autoNextNumber = this.invoiceIncrement.getNextInvoiceNumber(tenantId);

    // Invoice number.
    const invoiceNo =
      saleInvoiceDTO.invoiceNo || oldSaleInvoice?.invoiceNo || autoNextNumber;

    // Validate the invoice is required.
    this.validators.validateInvoiceNoRequire(invoiceNo);

    const initialEntries = saleInvoiceDTO.entries.map((entry) => ({
      referenceType: 'SaleInvoice',
      isInclusiveTax: saleInvoiceDTO.isInclusiveTax,
      ...entry,
    }));
    const asyncEntries = await composeAsync(
      // Associate tax rate from tax id to entries.
      this.taxDTOTransformer.assocTaxRateFromTaxIdToEntries(tenantId),
      // Associate tax rate id from tax code to entries.
      this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(tenantId),
      // Sets default cost and sell account to invoice items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const entries = R.compose(
      // Remove tax code from entries.
      R.map(R.omit(['taxCode']))
    )(asyncEntries);

    const initialDTO = {
      ...formatDateFields(
        omit(saleInvoiceDTO, [
          'delivered',
          'entries',
          'fromEstimateId',
          'attachments',
        ]),
        ['invoiceDate', 'dueDate']
      ),
      // Avoid rewrite the deliver date in edit mode when already published.
      balance: amount,
      currencyCode: customer.currencyCode,
      exchangeRate: saleInvoiceDTO.exchangeRate || 1,
      ...(saleInvoiceDTO.delivered &&
        !oldSaleInvoice?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
      // Avoid override payment amount in edit mode.
      ...(!oldSaleInvoice && { paymentAmount: 0 }),
      ...(invoiceNo ? { invoiceNo } : {}),
      entries,
      userId: authorizedUser.id,
    } as ISaleInvoice;

    return R.compose(
      this.taxDTOTransformer.assocTaxAmountWithheldFromEntries,
      this.branchDTOTransform.transformDTO<ISaleInvoice>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleInvoice>(tenantId)
    )(initialDTO);
  }

  /**
   * Transforms the DTO entries to invoice entries models.
   * @param {ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO} entries
   * @returns {IItemEntry[]}
   */
  private transformDTOEntriesToModels = (
    saleInvoiceDTO: ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO
  ): ItemEntry[] => {
    return saleInvoiceDTO.entries.map((entry) => {
      return ItemEntry.fromJson({
        ...entry,
        isInclusiveTax: saleInvoiceDTO.isInclusiveTax,
      });
    });
  };

  /**
   * Gets the due balance from the invoice entries.
   * @param {IItemEntry[]} entries
   * @returns {number}
   */
  private getDueBalanceItemEntries = (entries: ItemEntry[]) => {
    return sumBy(entries, (e) => e.amount);
  };
}
