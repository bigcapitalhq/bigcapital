import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { omit, sumBy } from 'lodash';
import { IBillPayment, IBillPaymentDTO, IVendor } from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { assocItemEntriesDefaultIndex } from '@/services/Items/utils';
import { formatDateFields } from '@/utils';

@Service()
export class CommandBillPaymentDTOTransformer {
  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Transforms create/edit DTO to model.
   * @param {number} tenantId
   * @param {IBillPaymentDTO} billPaymentDTO - Bill payment.
   * @param {IBillPayment} oldBillPayment - Old bill payment.
   * @return {Promise<IBillPayment>}
   */
  public async transformDTOToModel(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO,
    vendor: IVendor,
    oldBillPayment?: IBillPayment
  ): Promise<IBillPayment> {
    const amount =
      billPaymentDTO.amount ?? sumBy(billPaymentDTO.entries, 'paymentAmount');

    // Associate the default index to each item entry.
    const entries = R.compose(
      // Associate the default index to payment entries.
      assocItemEntriesDefaultIndex
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
    return R.compose(
      this.branchDTOTransform.transformDTO<IBillPayment>(tenantId)
    )(initialDTO);
  }
}
