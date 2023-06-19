import { Inject, Service } from 'typedi';
import moment from 'moment';
import { omit } from 'lodash';
import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { ServiceError } from '@/exceptions';
import {
  IVendorCredit,
  IVendorCreditCreateDTO,
  IVendorCreditEditDTO,
} from '@/interfaces';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import AutoIncrementOrdersService from '@/services/Sales/AutoIncrementOrdersService';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';

@Service()
export default class BaseVendorCredit {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  /**
   * Transformes the credit/edit vendor credit DTO to model.
   * @param   {number} tenantId -
   * @param   {IVendorCreditCreateDTO | IVendorCreditEditDTO} vendorCreditDTO
   * @param   {string} vendorCurrencyCode -
   * @param   {IVendorCredit} oldVendorCredit -
   * @returns {IVendorCredit}
   */
  public transformCreateEditDTOToModel = (
    tenantId: number,
    vendorCreditDTO: IVendorCreditCreateDTO | IVendorCreditEditDTO,
    vendorCurrencyCode: string,
    oldVendorCredit?: IVendorCredit
  ): IVendorCredit => {
    // Calculates the total amount of items entries.
    const amount = this.itemsEntriesService.getTotalItemsEntries(
      vendorCreditDTO.entries
    );
    const entries = vendorCreditDTO.entries.map((entry) => ({
      ...entry,
      referenceType: 'VendorCredit',
    }));
    // Retrieve the next vendor credit number.
    const autoNextNumber = this.getNextCreditNumber(tenantId);

    // Determines the credit note number.
    const vendorCreditNumber =
      vendorCreditDTO.vendorCreditNumber ||
      oldVendorCredit?.vendorCreditNumber ||
      autoNextNumber;

    const initialDTO = {
      ...omit(vendorCreditDTO, ['open']),
      amount,
      currencyCode: vendorCurrencyCode,
      exchangeRate: vendorCreditDTO.exchangeRate || 1,
      vendorCreditNumber,
      entries,
      ...(vendorCreditDTO.open &&
        !oldVendorCredit?.openedAt && {
          openedAt: moment().toMySqlDateTime(),
        }),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IVendorCredit>(tenantId),
      this.warehouseDTOTransform.transformDTO<IVendorCredit>(tenantId)
    )(initialDTO);
  };

  /**
   * Retrieve the vendor credit or throw not found service error.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   */
  public getVendorCreditOrThrowError = async (
    tenantId: number,
    vendorCreditId: number
  ): Promise<IVendorCredit> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    const vendorCredit = await VendorCredit.query().findById(vendorCreditId);

    if (!vendorCredit) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_NOT_FOUND);
    }
    return vendorCredit;
  };

  /**
   * Retrieve the next unique credit number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  private getNextCreditNumber = (tenantId: number): string => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'vendor_credit'
    );
  };

  /**
   * Increment the vendor credit serial next number.
   * @param {number} tenantId -
   */
  public incrementSerialNumber = (tenantId: number) => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'vendor_credit'
    );
  };

  /**
   * Validate the credit note remaining amount.
   * @param {ICreditNote} creditNote
   * @param {number} amount
   */
  public validateCreditRemainingAmount = (
    vendorCredit: IVendorCredit,
    amount: number
  ) => {
    if (vendorCredit.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
