import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { omit, sumBy } from 'lodash';
import {
  ICustomer,
  IPaymentReceived,
  IPaymentReceivedCreateDTO,
  IPaymentReceivedEditDTO,
} from '@/interfaces';
import { PaymentReceivedValidators } from './PaymentReceivedValidators';
import { PaymentReceivedIncrement } from './PaymentReceivedIncrement';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { formatDateFields } from '@/utils';

@Service()
export class PaymentReceiveDTOTransformer {
  @Inject()
  private validators: PaymentReceivedValidators;

  @Inject()
  private increments: PaymentReceivedIncrement;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Transformes the create payment receive DTO to model object.
   * @param {number} tenantId
   * @param {IPaymentReceivedCreateDTO|IPaymentReceivedEditDTO} paymentReceiveDTO - Payment receive DTO.
   * @param {IPaymentReceived} oldPaymentReceive -
   * @return {IPaymentReceived}
   */
  public async transformPaymentReceiveDTOToModel(
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceivedCreateDTO | IPaymentReceivedEditDTO,
    oldPaymentReceive?: IPaymentReceived
  ): Promise<IPaymentReceived> {
    const amount =
      paymentReceiveDTO.amount ??
      sumBy(paymentReceiveDTO.entries, 'paymentAmount');

    // Retreive the next invoice number.
    const autoNextNumber =
      this.increments.getNextPaymentReceiveNumber(tenantId);

    // Retrieve the next payment receive number.
    const paymentReceiveNo =
      paymentReceiveDTO.paymentReceiveNo ||
      oldPaymentReceive?.paymentReceiveNo ||
      autoNextNumber;

    this.validators.validatePaymentNoRequire(paymentReceiveNo);

    const initialDTO = {
      ...formatDateFields(omit(paymentReceiveDTO, ['entries', 'attachments']), [
        'paymentDate',
      ]),
      amount,
      currencyCode: customer.currencyCode,
      ...(paymentReceiveNo ? { paymentReceiveNo } : {}),
      exchangeRate: paymentReceiveDTO.exchangeRate || 1,
      entries: paymentReceiveDTO.entries.map((entry) => ({
        ...entry,
      })),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IPaymentReceived>(tenantId)
    )(initialDTO);
  }
}
