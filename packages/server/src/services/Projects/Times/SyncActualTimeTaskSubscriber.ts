import { Inject, Service } from 'typedi';
import {
  IProjectTimeCreatedEventPayload,
  IProjectTimeDeletedEventPayload,
  IProjectTimeEditedEventPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { SyncActualTimeTask } from './SyncActualTimeTask';

@Service()
export class SyncActualTimeTaskSubscriber {
  @Inject()
  private syncActualTimeTask: SyncActualTimeTask;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(
      events.projectTime.onCreated,
      this.handleIncreaseActualTimeOnTimeCreate
    );
    bus.subscribe(
      events.projectTime.onDeleted,
      this.handleDecreaseActualTimeOnTimeDelete
    );
    bus.subscribe(
      events.projectTime.onEdited,
      this.handleAdjustActualTimeOnTimeEdited
    );
  }

  /**
   * Handles increasing the actual time of the task once time entry be created.
   * @param {IProjectTimeCreatedEventPayload} payload -
   */
  private handleIncreaseActualTimeOnTimeCreate = async ({
    tenantId,
    time,
    trx,
  }: IProjectTimeCreatedEventPayload) => {
    await this.syncActualTimeTask.increaseActualTimeTask(
      tenantId,
      time.taskId,
      time.duration,
      trx
    );
  };

  /**
   * Handle decreasing the actual time of the tsak once time entry be deleted.
   * @param {IProjectTimeDeletedEventPayload} payload
   */
  private handleDecreaseActualTimeOnTimeDelete = async ({
    tenantId,
    oldTime,
    trx,
  }: IProjectTimeDeletedEventPayload) => {
    await this.syncActualTimeTask.decreaseActualTimeTask(
      tenantId,
      oldTime.taskId,
      oldTime.duration,
      trx
    );
  };

  /**
   * Handle adjusting the actual time of the task once time be edited.
   * @param {IProjectTimeEditedEventPayload} payload -
   */
  private handleAdjustActualTimeOnTimeEdited = async ({
    tenantId,
    time,
    oldTime,
    trx,
  }: IProjectTimeEditedEventPayload) => {
    await this.syncActualTimeTask.decreaseActualTimeTask(
      tenantId,
      oldTime.taskId,
      oldTime.duration,
      trx
    );
    await this.syncActualTimeTask.increaseActualTimeTask(
      tenantId,
      time.taskId,
      time.duration,
      trx
    );
  };
}
