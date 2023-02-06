import { Knex } from 'knex';

export interface IProjectTime {
  id?: number;
  duration: number;
  description: string;
  date: string | Date;
  taskId: number;
  projectId: number;
}
export interface BaseProjectTimeDTO {
  name: string;
  rate: number;
  chargeType: string;
  estimateHours: number;
}
export interface IProjectTimeCreateDTO extends BaseProjectTimeDTO {}
export interface IProjectTimeEditDTO extends BaseProjectTimeDTO {}

export interface IProjectTimeCreatePOJO extends IProjectTime {}
export interface IProjectTimeEditPOJO extends IProjectTime{}
export interface IProjectTimeGetPOJO extends IProjectTime{}

export interface IProjectTimeCreateEventPayload {
  tenantId: number;
  timeDTO: IProjectTimeCreateDTO;
}
export interface IProjectTimeCreatedEventPayload {
  tenantId: number;
  timeDTO: IProjectTimeEditDTO;
  time: any;
  trx: Knex.Transaction;
}
export interface IProjectTimeCreatingEventPayload {
  tenantId: number;
  timeDTO: IProjectTimeEditDTO;
  trx: Knex.Transaction;
}
export interface IProjectTimeDeleteEventPayload {
  tenantId: number;
  timeId: number;
  trx?: Knex.Transaction;
}
export interface IProjectTimeDeletingEventPayload {
  tenantId: number;
  oldTime: IProjectTime;
  trx: Knex.Transaction;
}
export interface IProjectTimeDeletedEventPayload {
  tenantId: number;
  oldTime: IProjectTime;
  trx: Knex.Transaction;
}
export interface IProjectTimeEditEventPayload {
  tenantId: number;
  oldTime: IProjectTime;
  timeDTO: IProjectTimeEditDTO;
}
export interface IProjectTimeEditingEventPayload {
  tenantId: number;
  oldTime: IProjectTime;
  timeDTO: IProjectTimeEditDTO;
  trx: Knex.Transaction;
}

export interface IProjectTimeEditedEventPayload {
  tenantId: number;
  oldTime: IProjectTime;
  time: IProjectTime;
  timeDTO: IProjectTimeEditDTO;
  trx: Knex.Transaction;
}
