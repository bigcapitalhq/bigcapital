import { Inject, Injectable } from '@nestjs/common';
import { omit, sumBy } from 'lodash';
import * as R from 'ramda';
import * as moment from 'moment';
import '../../../utils/moment-mysql';
import * as composeAsync from 'async/compose';
import { Customer } from '@/modules/Customers/models/Customer';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators.service';
import { SaleInvoiceIncrement } from './SaleInvoiceIncrement.service';
import { BrandingTemplateDTOTransformer } from '@/modules/PdfTemplate/BrandingTemplateDTOTransformer';
import { SaleInvoice } from '../models/SaleInvoice';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { formatDateFields } from '@/utils/format-date-fields';
import { ItemEntriesTaxTransactions } from '@/modules/TaxRates/ItemEntriesTaxTransactions.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  CreateSaleInvoiceDto,
  EditSaleInvoiceDto,
} from '../dtos/SaleInvoice.dto';

@Injectable()
export class CommandSaleInvoiceDTOTransformer {
  /**
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - Branch transaction DTO transformer.
   * @param {WarehouseTransactionDTOTransform} warehouseDTOTransform - Warehouse transaction DTO transformer.
   * @param {ItemsEntriesService} itemsEntriesService - Items entries service.
   * @param {CommandSaleInvoiceValidators} validators - Command sale invoice validators.
   * @param {SaleInvoiceIncrement} invoiceIncrement - Sale invoice increment.
   * @param {ItemEntriesTaxTransactions} taxDTOTransformer - Item entries tax transactions.
   * @param {BrandingTemplateDTOTransformer} brandingTemplatesTransformer - Branding template DTO transformer.
   * @param {TenancyContext} tenancyContext - Tenancy context.
   * @param {SaleInvoice} saleInvoiceModel - Sale invoice model.
   */
  constructor(
    private branchDTOTransform: BranchTransactionDTOTransformer,
    private warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private itemsEntriesService: ItemsEntriesService,
    private validators: CommandSaleInvoiceValidators,
    private invoiceIncrement: SaleInvoiceIncrement,
    private taxDTOTransformer: ItemEntriesTaxTransactions,
    private brandingTemplatesTransformer: BrandingTemplateDTOTransformer,
    private tenancyContext: TenancyContext,
  ) {}

  /**
   * Transformes the create DTO to invoice object model.
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO - Sale invoice DTO.
   * @param {ISaleInvoice} oldSaleInvoice - Old sale invoice.
   * @return {ISaleInvoice}
   */
  public async transformDTOToModel(
    customer: Customer,
    saleInvoiceDTO: CreateSaleInvoiceDto | EditSaleInvoiceDto,
    oldSaleInvoice?: SaleInvoice,
  ): Promise<SaleInvoice> {
    const entriesModels = this.transformDTOEntriesToModels(saleInvoiceDTO);
    const amount = this.getDueBalanceItemEntries(entriesModels);

    // Retreive the next invoice number.
    const autoNextNumber = await this.invoiceIncrement.getNextInvoiceNumber();

    // Retrieve the authorized user.
    const authorizedUser = await this.tenancyContext.getSystemUser();

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

    // Process entries sequentially to avoid async compose issues
    const step1 = await this.itemsEntriesService.setItemsEntriesDefaultAccounts(initialEntries);
    const step2 = await this.taxDTOTransformer.assocTaxRateIdFromCodeToEntries(step1);
    const asyncEntries = await this.taxDTOTransformer.assocTaxRatesFromTaxIdsToEntries(
      step2,
      saleInvoiceDTO.isInclusiveTax,
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

      // Associate the default index for each item entry line.
      assocItemEntriesDefaultIndex,
    )(asyncEntries);

    const initialDTO = {
      ...formatDateFields(
        omit(saleInvoiceDTO, [
          'delivered',
          'entries',
          'fromEstimateId',
          'attachments',
        ]),
        ['invoiceDate', 'dueDate'],
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
    } as SaleInvoice;

    const initialAsyncDTO = await composeAsync(
      this.branchDTOTransform.transformDTO<SaleInvoice>,
      this.warehouseDTOTransform.transformDTO<SaleInvoice>,

      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'SaleInvoice',
      ),
    )(initialDTO);

    return R.compose(this.taxDTOTransformer.assocTaxAmountWithheldFromEntries)(
      initialAsyncDTO,
    );
  }

  /**
   * Transforms the DTO entries to invoice entries models.
   * @param {ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO} entries
   * @returns {IItemEntry[]}
   */
  private transformDTOEntriesToModels = (
    saleInvoiceDTO: CreateSaleInvoiceDto | EditSaleInvoiceDto,
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
