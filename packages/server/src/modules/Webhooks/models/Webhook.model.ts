import { BaseModel } from '@/models/Model';

export class Webhook extends BaseModel {
  id!: number;
  name!: string;
  url!: string;
  secret?: string;
  entity!: string;
  events!: string[];
  method!: 'POST' | 'PUT' | 'DELETE';
  headers?: Array<{ param_name: string; param_value: string }>;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'webhooks';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get jsonAttributes() {
    return ['events', 'headers'];
  }
}
