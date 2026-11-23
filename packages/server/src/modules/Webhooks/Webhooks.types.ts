export enum WebhookAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
}

export interface WebhookHeader {
  param_name: string;
  param_value: string;
}

export interface WebhookDeliveryQueueJobPayload {
  webhookId: number;
  eventType: string;
  payload: Record<string, any>;
  organizationId: string;
  userId: number;
  deliveryId: number;
}

export interface WebhookEventMapping {
  internalEvent: string;
  entity: string;
  action: string;
  dataKey: string;
  idKey: string;
}
