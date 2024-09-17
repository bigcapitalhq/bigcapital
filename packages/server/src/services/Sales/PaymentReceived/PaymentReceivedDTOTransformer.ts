import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { omit, sumBy } from 'lodash';
import composeAsync from 'async/compose';
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
import { assocItemEntriesDefaultIndex } from '@/services/Items/utils';
import { BrandingTemplateDTOTransformer } from '@/services/PdfTemplate/BrandingTemplateDTOTransformer';

@Service()
export class PaymentReceiveDTOTransformer {
  @Inject()
  private validators: PaymentReceivedValidators;

  @Inject()
  private increments: PaymentReceivedIncrement;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private brandingTemplatesTransformer: BrandingTemplateDTOTransformer;

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

    const entries = R.compose(
      // Associate the default index to each item entry line.
      assocItemEntriesDefaultIndex
    )(paymentReceiveDTO.entries);

    const initialDTO = {
      ...formatDateFields(omit(paymentReceiveDTO, ['entries', 'attachments']), [
        'paymentDate',
      ]),
      amount,
      currencyCode: customer.currencyCode,
      ...(paymentReceiveNo ? { paymentReceiveNo } : {}),
      exchangeRate: paymentReceiveDTO.exchangeRate || 1,
      entries,
    };
    const initialAsyncDTO = await composeAsync(
      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        tenantId,
        'SaleInvoice'
      )
    )(initialDTO);

    return R.compose(
      this.branchDTOTransform.transformDTO<IPaymentReceived>(tenantId)
    )(initialAsyncDTO);
  }
}
