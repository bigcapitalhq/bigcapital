import { IBillPayment, IBillPaymentDTO, IVendor } from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { formatDateFields } from '@/utils';
import { sumBy } from 'lodash';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';

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
    oldBillPayment?: IBillPayment,
  ): Promise<IBillPayment> {
    const initialDTO = {
      ...formatDateFields(billPaymentDTO, ['paymentDate']),
      amount: sumBy(billPaymentDTO.entries, 'paymentAmount'),
      currencyCode: vendor.currencyCode,
      exchangeRate: billPaymentDTO.exchangeRate || 1,
      entries: billPaymentDTO.entries,
    };
    return R.compose(this.branchDTOTransform.transformDTO<IBillPayment>(tenantId))(initialDTO);
  }
}
