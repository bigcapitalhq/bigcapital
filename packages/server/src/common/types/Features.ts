export enum Features {
  WAREHOUSES = 'warehouses',
  BRANCHES = 'branches',
  BankSyncing = 'BankSyncing',
  LANDED_COST = 'landed_cost',
  SMS_NOTIFICATIONS = 'sms_notifications',
  SALES_TAX = 'sales_tax',
  TRACKING_CATEGORIES = 'tracking_categories',
  RECURRING_JOURNALS = 'recurring_journals',
  BATCH_TRACKING = 'batch_tracking',
}

export interface IFeatureAllItem {
  name: string;
  isAccessible: boolean;
  defaultAccessible: boolean;
}

export interface IFeatureConfiugration {
  name: string;
  defaultValue?: boolean;
}
