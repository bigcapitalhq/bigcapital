import TenantModel from 'models/TenantModel';
import { mixin } from 'objection';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';
import ModelSetting from './ModelSetting';

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
