import {
  BillsActivateWarehousesSubscriber,
  CreditsActivateWarehousesSubscriber,
  InvoicesActivateWarehousesSubscriber,
  ReceiptsActivateWarehousesSubscriber,
  EstimatesActivateWarehousesSubscriber,
  InventoryActivateWarehousesSubscriber,
  VendorCreditsActivateWarehousesSubscriber,
} from './Subscribers/Activate';
import {
  BillWarehousesValidateSubscriber,
  CreditNoteWarehousesValidateSubscriber,
  SaleReceiptWarehousesValidateSubscriber,
  SaleEstimateWarehousesValidateSubscriber,
  SaleInvoicesWarehousesValidateSubscriber,
  VendorCreditWarehousesValidateSubscriber,
  InventoryAdjustmentWarehouseValidatorSubscriber,
} from './Subscribers/Validators';
import { DeleteItemWarehousesQuantitySubscriber } from './Subscribers/DeleteItemWarehousesQuantitySubscriber';

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
