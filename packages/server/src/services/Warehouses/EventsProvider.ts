import {
  BillsActivateWarehousesSubscriber,
  CreditsActivateWarehousesSubscriber,
  EstimatesActivateWarehousesSubscriber,
  InventoryActivateWarehousesSubscriber,
  InvoicesActivateWarehousesSubscriber,
  ReceiptsActivateWarehousesSubscriber,
  VendorCreditsActivateWarehousesSubscriber,
} from './Subscribers/Activate';
import { DeleteItemWarehousesQuantitySubscriber } from './Subscribers/DeleteItemWarehousesQuantitySubscriber';
import {
  BillWarehousesValidateSubscriber,
  CreditNoteWarehousesValidateSubscriber,
  InventoryAdjustmentWarehouseValidatorSubscriber,
  SaleEstimateWarehousesValidateSubscriber,
  SaleInvoicesWarehousesValidateSubscriber,
  SaleReceiptWarehousesValidateSubscriber,
  VendorCreditWarehousesValidateSubscriber,
} from './Subscribers/Validators';

export default () => [
  BillsActivateWarehousesSubscriber,
  CreditsActivateWarehousesSubscriber,
  InvoicesActivateWarehousesSubscriber,
  ReceiptsActivateWarehousesSubscriber,
  EstimatesActivateWarehousesSubscriber,
  InventoryActivateWarehousesSubscriber,
  VendorCreditsActivateWarehousesSubscriber,

  BillWarehousesValidateSubscriber,
  CreditNoteWarehousesValidateSubscriber,
  SaleReceiptWarehousesValidateSubscriber,
  SaleEstimateWarehousesValidateSubscriber,
  SaleInvoicesWarehousesValidateSubscriber,
  VendorCreditWarehousesValidateSubscriber,
  InventoryAdjustmentWarehouseValidatorSubscriber,

  DeleteItemWarehousesQuantitySubscriber,
];
