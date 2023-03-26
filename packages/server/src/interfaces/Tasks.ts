import { Knex } from 'knex';
import { ProjectTaskChargeType } from '@/services/Projects/Tasks/constants';

export interface IProjectTask {
  id?: number;
  name: string;
  chargeType: string;
  estimateHours: number;
  actualHours: number;
  invoicedHours: number;
  billableHours: number;
  projectId: number;

  billableAmount?: number;
  createdAt?: Date|string;
}

export interface BaseTaskDTO {
  name: string;
  rate: number;
  chargeType: ProjectTaskChargeType;
  estimateHours: number;
}
export interface ICreateTaskDTO extends BaseTaskDTO {}
export interface IEditTaskDTO extends BaseTaskDTO {}

export interface IProjectTaskCreatePOJO extends IProjectTask {}
export interface IProjectTaskEditPOJO extends IProjectTask {}
export interface IProjectTaskGetPOJO extends IProjectTask {}

export interface ITaskCreateEventPayload {
  tenantId: number;
  taskDTO: ICreateTaskDTO;
}
export interface ITaskCreatedEventPayload {
  tenantId: number;
  taskDTO: ICreateTaskDTO;
  task: any;
  trx: Knex.Transaction;
}
export interface ITaskCreatingEventPayload {
  tenantId: number;
  taskDTO: ICreateTaskDTO;
  trx: Knex.Transaction;
}
export interface ITaskDeleteEventPayload {
  tenantId: number;
  taskId: number;
}
export interface ITaskDeletingEventPayload {
  tenantId: number;
  oldTask: IProjectTask;
  trx: Knex.Transaction;
}
export interface ITaskDeletedEventPayload {
  tenantId: number;
  oldTask: IProjectTask;
  task: IProjectTask;
  trx: Knex.Transaction;
}
export interface ITaskEditEventPayload {
  tenantId: number;
  taskId: number;
  taskDTO: IEditTaskDTO;
}
export interface ITaskEditingEventPayload {
  tenantId: number;
  oldTask: IProjectTask;
  taskDTO: IEditTaskDTO;
  trx: Knex.Transaction;
}
export interface ITaskEditedEventPayload {
  tenantId: number;
  oldTask: IProjectTask;
  task: IProjectTask;
  taskDTO: IEditTaskDTO;
  trx: Knex.Transaction;
}
