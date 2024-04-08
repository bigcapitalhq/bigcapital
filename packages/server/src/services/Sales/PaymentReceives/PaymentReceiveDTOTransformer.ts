import { ICustomer, IPaymentReceive, IPaymentReceiveCreateDTO, IPaymentReceiveEditDTO } from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { formatDateFields } from '@/utils';
import { omit, sumBy } from 'lodash';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { PaymentReceiveIncrement } from './PaymentReceiveIncrement';
import { PaymentReceiveValidators } from './PaymentReceiveValidators';

@Service()
export class PaymentReceiveDTOTransformer {
  @Inject()
  private validators: PaymentReceiveValidators;

  @Inject()
  private increments: PaymentReceiveIncrement;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Transformes the create payment receive DTO to model object.
   * @param {number} tenantId
   * @param {IPaymentReceiveCreateDTO|IPaymentReceiveEditDTO} paymentReceiveDTO - Payment receive DTO.
   * @param {IPaymentReceive} oldPaymentReceive -
   * @return {IPaymentReceive}
   */
  public async transformPaymentReceiveDTOToModel(
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveCreateDTO | IPaymentReceiveEditDTO,
    oldPaymentReceive?: IPaymentReceive,
  ): Promise<IPaymentReceive> {
    const paymentAmount = sumBy(paymentReceiveDTO.entries, 'paymentAmount');

    // Retreive the next invoice number.
    const autoNextNumber = this.increments.getNextPaymentReceiveNumber(tenantId);

    // Retrieve the next payment receive number.
    const paymentReceiveNo =
      paymentReceiveDTO.paymentReceiveNo || oldPaymentReceive?.paymentReceiveNo || autoNextNumber;

    this.validators.validatePaymentNoRequire(paymentReceiveNo);

    const initialDTO = {
      ...formatDateFields(omit(paymentReceiveDTO, ['entries']), ['paymentDate']),
      amount: paymentAmount,
      currencyCode: customer.currencyCode,
      ...(paymentReceiveNo ? { paymentReceiveNo } : {}),
      exchangeRate: paymentReceiveDTO.exchangeRate || 1,
      entries: paymentReceiveDTO.entries.map((entry) => ({
        ...entry,
      })),
    };
    return R.compose(this.branchDTOTransform.transformDTO<IPaymentReceive>(tenantId))(initialDTO);
  }
}
