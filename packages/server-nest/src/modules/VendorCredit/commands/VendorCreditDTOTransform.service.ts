import * as moment from 'moment';
import { omit } from 'lodash';
import * as R from 'ramda';
import { ERRORS } from '../constants';
import {
  IVendorCreditCreateDTO,
  IVendorCreditEditDTO,
  IVendorCreditEntryDTO,
} from '../types/VendorCredit.types';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { VendorCredit } from '../models/VendorCredit';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { VendorCreditAutoIncrementService } from './VendorCreditAutoIncrement.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorCreditDTOTransformService {
  /**
   * @param {ItemsEntriesService} itemsEntriesService - The items entries service.
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - The branch transaction DTO transformer.
   * @param {WarehouseTransactionDTOTransform} warehouseDTOTransform - The warehouse transaction DTO transformer.
   * @param {VendorCreditAutoIncrementService} vendorCreditAutoIncrement - The vendor credit auto increment service.
   */
  constructor(
    private itemsEntriesService: ItemsEntriesService,
    private branchDTOTransform: BranchTransactionDTOTransformer,
    private warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private vendorCreditAutoIncrement: VendorCreditAutoIncrementService,
  ) {}

  /**
   * Transformes the credit/edit vendor credit DTO to model.
   * @param {IVendorCreditCreateDTO | IVendorCreditEditDTO} vendorCreditDTO
   * @param {string} vendorCurrencyCode -
   * @param {IVendorCredit} oldVendorCredit -
   * @returns {VendorCredit}
   */
  public transformCreateEditDTOToModel = (
    vendorCreditDTO: IVendorCreditCreateDTO | IVendorCreditEditDTO,
    vendorCurrencyCode: string,
    oldVendorCredit?: VendorCredit,
  ): VendorCredit => {
    // Calculates the total amount of items entries.
    const amount = this.itemsEntriesService.getTotalItemsEntries(
      vendorCreditDTO.entries,
    );
    const entries = R.compose(
      // Associate the default index to each item entry.
      assocItemEntriesDefaultIndex,

      // Associate the reference type to item entries.
      R.map((entry: IVendorCreditEntryDTO) => ({
        referenceType: 'VendorCredit',
        ...entry,
      })),
    )(vendorCreditDTO.entries);

    // Retreive the next vendor credit number.
    const autoNextNumber = this.vendorCreditAutoIncrement.getNextCreditNumber();

    // Detarmines the credit note number.
    const vendorCreditNumber =
      vendorCreditDTO.vendorCreditNumber ||
      oldVendorCredit?.vendorCreditNumber ||
      autoNextNumber;

    const initialDTO = {
      ...omit(vendorCreditDTO, ['open', 'attachments']),
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
      this.branchDTOTransform.transformDTO<VendorCredit>,
      this.warehouseDTOTransform.transformDTO<VendorCredit>,
    )(initialDTO) as VendorCredit;
  };

  /**
   * Validate the credit note remaining amount.
   * @param {ICreditNote} creditNote
   * @param {number} amount
   */
  public validateCreditRemainingAmount = (
    vendorCredit: VendorCredit,
    amount: number,
  ) => {
    if (vendorCredit.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
