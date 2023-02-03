import { mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';

export default class CreditNoteAppliedInvoiceEntry extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'credit_associated_transaction_entry';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
