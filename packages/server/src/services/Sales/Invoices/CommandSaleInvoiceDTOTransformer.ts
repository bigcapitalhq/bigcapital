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
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { SaleInvoiceIncrement } from './SaleInvoiceIncrement';
import { formatDateFields } from 'utils';

@Service()
export class CommandSaleInvoiceDTOTransformer {
  @Inject()
  private tenancy: HasTenancyService;

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
    const { ItemEntry } = this.tenancy.models(tenantId);

    const balance = sumBy(saleInvoiceDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );
    // Retreive the next invoice number.
    const autoNextNumber = this.invoiceIncrement.getNextInvoiceNumber(tenantId);

    // Invoice number.
    const invoiceNo =
      saleInvoiceDTO.invoiceNo || oldSaleInvoice?.invoiceNo || autoNextNumber;

    // Validate the invoice is required.
    this.validators.validateInvoiceNoRequire(invoiceNo);

    const initialEntries = saleInvoiceDTO.entries.map((entry) => ({
      referenceType: 'SaleInvoice',
      ...entry,
    }));
    const entries = await composeAsync(
      // Sets default cost and sell account to invoice items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const initialDTO = {
      ...formatDateFields(
        omit(saleInvoiceDTO, ['delivered', 'entries', 'fromEstimateId']),
        ['invoiceDate', 'dueDate']
      ),
      // Avoid rewrite the deliver date in edit mode when already published.
      balance,
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
      this.branchDTOTransform.transformDTO<ISaleInvoice>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleInvoice>(tenantId)
    )(initialDTO);
  }
}
