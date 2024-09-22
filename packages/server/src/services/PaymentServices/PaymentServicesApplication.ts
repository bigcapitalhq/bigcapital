import { Service, Inject } from 'typedi';
import { GetPaymentServicesSpecificInvoice } from './GetPaymentServicesSpecificInvoice';
import { DeletePaymentMethodService } from './DeletePaymentMethodService';
import { EditPaymentMethodService } from './EditPaymentMethodService';
import { EditPaymentMethodDTO, GetPaymentMethodsPOJO } from './types';
import { GetPaymentMethodsStateService } from './GetPaymentMethodsState';
import { GetPaymentMethodService } from './GetPaymentService';

@Service()
export class PaymentServicesApplication {
  @Inject()
  private getPaymentServicesSpecificInvoice: GetPaymentServicesSpecificInvoice;

  @Inject()
  private deletePaymentMethodService: DeletePaymentMethodService;

  @Inject()
  private editPaymentMethodService: EditPaymentMethodService;

  @Inject()
  private getPaymentMethodsStateService: GetPaymentMethodsStateService;

  @Inject()
  private getPaymentMethodService: GetPaymentMethodService;

  /**
   * Retrieves the payment services for a specific invoice.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} invoiceId - The ID of the invoice.
   * @returns {Promise<any>} The payment services for the specified invoice.
   */
  public async getPaymentServicesForInvoice(tenantId: number): Promise<any> {
    return this.getPaymentServicesSpecificInvoice.getPaymentServicesInvoice(
      tenantId
    );
  }

  /**
   * Retrieves specific payment service details.
   * @param {number} tenantId - Tennat id.
   * @param {number} paymentServiceId - Payment service id.
   */
  public async getPaymentService(tenantId: number, paymentServiceId: number) {
    return this.getPaymentMethodService.getPaymentMethod(
      tenantId,
      paymentServiceId
    );
  }

  /**
   * Deletes the given payment method.
   * @param {number} tenantId
   * @param {number} paymentIntegrationId
   * @returns {Promise<void>}
   */
  public async deletePaymentMethod(
    tenantId: number,
    paymentIntegrationId: number
  ): Promise<void> {
    return this.deletePaymentMethodService.deletePaymentMethod(
      tenantId,
      paymentIntegrationId
    );
  }

  /**
   * Edits the given payment method.
   * @param {number} tenantId
   * @param {number} paymentIntegrationId
   * @param {EditPaymentMethodDTO} editPaymentMethodDTO
   * @returns {Promise<void>}
   */
  public async editPaymentMethod(
    tenantId: number,
    paymentIntegrationId: number,
    editPaymentMethodDTO: EditPaymentMethodDTO
  ): Promise<void> {
    return this.editPaymentMethodService.editPaymentMethod(
      tenantId,
      paymentIntegrationId,
      editPaymentMethodDTO
    );
  }

  /**
   * Retrieves the payment state providing state.
   * @param {number} tenantId
   * @returns {Promise<GetPaymentMethodsPOJO>}
   */
  public async getPaymentMethodsState(
    tenantId: number
  ): Promise<GetPaymentMethodsPOJO> {
    return this.getPaymentMethodsStateService.getPaymentMethodsState(tenantId);
  }
}
