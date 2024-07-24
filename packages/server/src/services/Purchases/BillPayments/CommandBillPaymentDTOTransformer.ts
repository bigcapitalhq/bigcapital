import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { omit, sumBy } from 'lodash';
import { IBillPayment, IBillPaymentDTO, IVendor } from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { formatDateFields } from '@/utils';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class CommandBillPaymentDTOTransformer {
  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private tenancy: HasTenancyService;

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
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const appliedAmount = sumBy(billPaymentDTO.entries, 'paymentAmount');

    const hasPrepardExpenses = appliedAmount < billPaymentDTO.amount;
    const prepardExpensesAccount = hasPrepardExpenses
      ? await accountRepository.findOrCreatePrepardExpenses()
      : null;
    const prepardExpensesAccountId =
      hasPrepardExpenses && prepardExpensesAccount
        ? billPaymentDTO.prepardExpensesAccountId ?? prepardExpensesAccount?.id
        : billPaymentDTO.prepardExpensesAccountId;

    const initialDTO = {
      ...formatDateFields(omit(billPaymentDTO, ['attachments']), [
        'paymentDate',
      ]),
      appliedAmount,
      currencyCode: vendor.currencyCode,
      exchangeRate: billPaymentDTO.exchangeRate || 1,
      entries: billPaymentDTO.entries,
      prepardExpensesAccountId,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IBillPayment>(tenantId)
    )(initialDTO);
  }
}
