import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { omit, sumBy } from 'lodash';
import {
  ICustomer,
  IPaymentReceive,
  IPaymentReceiveCreateDTO,
  IPaymentReceiveEditDTO,
} from '@/interfaces';
import { PaymentReceiveValidators } from './PaymentReceiveValidators';
import { PaymentReceiveIncrement } from './PaymentReceiveIncrement';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { formatDateFields } from '@/utils';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class PaymentReceiveDTOTransformer {
  @Inject()
  private validators: PaymentReceiveValidators;

  @Inject()
  private increments: PaymentReceiveIncrement;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private tenancy: HasTenancyService;

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
    oldPaymentReceive?: IPaymentReceive
  ): Promise<IPaymentReceive> {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const appliedAmount = sumBy(paymentReceiveDTO.entries, 'paymentAmount');

    // Retreive the next invoice number.
    const autoNextNumber =
      this.increments.getNextPaymentReceiveNumber(tenantId);

    // Retrieve the next payment receive number.
    const paymentReceiveNo =
      paymentReceiveDTO.paymentReceiveNo ||
      oldPaymentReceive?.paymentReceiveNo ||
      autoNextNumber;

    this.validators.validatePaymentNoRequire(paymentReceiveNo);

    const hasUnearnedPayment = appliedAmount < paymentReceiveDTO.amount;
    const unearnedRevenueAccount = hasUnearnedPayment
      ? await accountRepository.findOrCreateUnearnedRevenue()
      : null;

    const unearnedRevenueAccountId =
      hasUnearnedPayment && unearnedRevenueAccount
        ? paymentReceiveDTO.unearnedRevenueAccountId ??
          unearnedRevenueAccount?.id
        : paymentReceiveDTO.unearnedRevenueAccountId;

    const initialDTO = {
      ...formatDateFields(omit(paymentReceiveDTO, ['entries', 'attachments']), [
        'paymentDate',
      ]),
      appliedAmount,
      currencyCode: customer.currencyCode,
      ...(paymentReceiveNo ? { paymentReceiveNo } : {}),
      exchangeRate: paymentReceiveDTO.exchangeRate || 1,
      entries: paymentReceiveDTO.entries.map((entry) => ({
        ...entry,
      })),
      unearnedRevenueAccountId,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IPaymentReceive>(tenantId)
    )(initialDTO);
  }
}
