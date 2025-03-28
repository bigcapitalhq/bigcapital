import { Service, Inject } from 'typedi';
import { GetPaymentServicesSpecificInvoice } from './queries/GetPaymentServicesSpecificInvoice';
import { DeletePaymentMethodService } from './commands/DeletePaymentMethodService';
import { EditPaymentMethodService } from './commands/EditPaymentMethodService';
import { EditPaymentMethodDTO, GetPaymentMethodsPOJO } from './types';
import { GetPaymentMethodsStateService } from './queries/GetPaymentMethodsState';
import { GetPaymentMethodService } from './queries/GetPaymentService';

@Service()
export class PaymentServicesApplication {
  constructor(
    private readonly getPaymentServicesSpecificInvoice: GetPaymentServicesSpecificInvoice,
    private readonly deletePaymentMethodService: DeletePaymentMethodService,
    private readonly editPaymentMethodService: EditPaymentMethodService,
    private readonly getPaymentMethodsStateService: GetPaymentMethodsStateService,
    private readonly getPaymentMethodService: GetPaymentMethodService,
  ) {}

  /**
   * Retrieves the payment services for a specific invoice.
   * @param {number} invoiceId - The ID of the invoice.
   * @returns {Promise<any>} The payment services for the specified invoice.
   */
  public async getPaymentServicesForInvoice(): Promise<any> {
    return this.getPaymentServicesSpecificInvoice.getPaymentServicesInvoice(
      tenantId,
    );
  }

  /**
   * Retrieves specific payment service details.
   * @param {number} paymentServiceId - Payment service id.
   */
  public async getPaymentService(paymentServiceId: number) {
    return this.getPaymentMethodService.getPaymentMethod(paymentServiceId);
  }

  /**
   * Deletes the given payment method.
   * @param {number} paymentIntegrationId
   * @returns {Promise<void>}
   */
  public async deletePaymentMethod(
    paymentIntegrationId: number,
  ): Promise<void> {
    return this.deletePaymentMethodService.deletePaymentMethod(
      paymentIntegrationId,
    );
  }

  /**
   * Edits the given payment method.
   * @param {number} paymentIntegrationId
   * @param {EditPaymentMethodDTO} editPaymentMethodDTO
   * @returns {Promise<void>}
   */
  public async editPaymentMethod(
    paymentIntegrationId: number,
    editPaymentMethodDTO: EditPaymentMethodDTO,
  ): Promise<void> {
    return this.editPaymentMethodService.editPaymentMethod(
      paymentIntegrationId,
      editPaymentMethodDTO,
    );
  }

  /**
   * Retrieves the payment state providing state.
   * @param {number} tenantId
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethodsState(): Promise<GetPaymentMethodsPOJO> {
    return this.getPaymentMethodsStateService.getPaymentMethodsState();
  }
}
