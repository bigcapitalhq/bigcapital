import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { sumBy, omit } from 'lodash';
import composeAsync from 'async/compose';
import moment from 'moment';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { SaleReceiptValidators } from './SaleReceiptValidators';
import { ICustomer, ISaleReceipt, ISaleReceiptDTO } from '@/interfaces';
import { formatDateFields } from '@/utils';
import { SaleReceiptIncrement } from './SaleReceiptIncrement';
import { ItemEntry } from '@/models';

@Service()
export class SaleReceiptDTOTransformer {
  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private validators: SaleReceiptValidators;

  @Inject()
  private receiptIncrement: SaleReceiptIncrement;

  /**
   * Transform create DTO object to model object.
   * @param {ISaleReceiptDTO} saleReceiptDTO -
   * @param {ISaleReceipt} oldSaleReceipt -
   * @returns {ISaleReceipt}
   */
  async transformDTOToModel(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO,
    paymentCustomer: ICustomer,
    oldSaleReceipt?: ISaleReceipt
  ): Promise<ISaleReceipt> {
    const amount = sumBy(saleReceiptDTO.entries, (e) =>
      ItemEntry.calcAmount(e)
    );
    // Retreive the next invoice number.
    const autoNextNumber = this.receiptIncrement.getNextReceiptNumber(tenantId);

    // Retreive the receipt number.
    const receiptNumber =
      saleReceiptDTO.receiptNumber ||
      oldSaleReceipt?.receiptNumber ||
      autoNextNumber;

    // Validate receipt number require.
    this.validators.validateReceiptNoRequire(receiptNumber);

    const initialEntries = saleReceiptDTO.entries.map((entry) => ({
      reference_type: 'SaleReceipt',
      ...entry,
    }));

    const entries = await composeAsync(
      // Sets default cost and sell account to receipt items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId)
    )(initialEntries);

    const initialDTO = {
      amount,
      ...formatDateFields(
        omit(saleReceiptDTO, ['closed', 'entries', 'attachments']),
        ['receiptDate']
      ),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: saleReceiptDTO.exchangeRate || 1,
      receiptNumber,
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(saleReceiptDTO.closed &&
        !oldSaleReceipt?.closedAt && {
          closedAt: moment().toMySqlDateTime(),
        }),
      entries,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleReceipt>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleReceipt>(tenantId)
    )(initialDTO);
  }
}
