import { Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { omit, sumBy } from 'lodash';
import { formatDateFields } from '@/utils/format-date-fields';
import { IBillPaymentDTO } from '../types/BillPayments.types';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { BillPayment } from '../models/BillPayment';

@Injectable()
export class CommandBillPaymentDTOTransformer {
  constructor(
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
  ) {}

  /**
   * Transforms create/edit DTO to model.
   * @param {number} tenantId
   * @param {IBillPaymentDTO} billPaymentDTO - Bill payment.
   * @param {IBillPayment} oldBillPayment - Old bill payment.
   * @return {Promise<IBillPayment>}
   */
  public async transformDTOToModel(
    billPaymentDTO: IBillPaymentDTO,
    vendor: Vendor,
    oldBillPayment?: BillPayment,
  ): Promise<BillPayment> {
    const amount =
      billPaymentDTO.amount ?? sumBy(billPaymentDTO.entries, 'paymentAmount');

    // Associate the default index to each item entry.
    const entries = R.compose(
      // Associate the default index to payment entries.
      assocItemEntriesDefaultIndex,
    )(billPaymentDTO.entries);

    const initialDTO = {
      ...formatDateFields(omit(billPaymentDTO, ['attachments']), [
        'paymentDate',
      ]),
      amount,
      currencyCode: vendor.currencyCode,
      exchangeRate: billPaymentDTO.exchangeRate || 1,
      entries,
    };
    return R.compose(this.branchDTOTransform.transformDTO<BillPayment>)(
      initialDTO,
    );
  }
}
