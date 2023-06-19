import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  ITaskDeletedEventPayload,
  ITaskDeleteEventPayload,
  ITaskDeletingEventPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class DeleteTaskService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes the give project.
   * @param   {number} projectId -
   * @returns {Promise<void>}
   */
  public deleteTask = async (
    tenantId: number,
    taskId: number
  ): Promise<void> => {
    const { Task } = this.tenancy.models(tenantId);

    // Validate customer existance.
    const oldTask = await Task.query().findById(taskId).throwIfNotFound();

    // Triggers `onDeleteProjectTask` event.
    await this.eventPublisher.emitAsync(events.projectTask.onDelete, {
      tenantId,
      taskId,
    } as ITaskDeleteEventPayload);

    // Deletes the given project under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectDeleting` event.
      await this.eventPublisher.emitAsync(events.projectTask.onDeleting, {
        tenantId,
        oldTask,
        trx,
      } as ITaskDeletingEventPayload);

      // Deletes the project object from the storage.
      await Task.query(trx).findById(taskId).delete();

      // Triggers `onProjectDeleted` event.
      await this.eventPublisher.emitAsync(events.projectTask.onDeleted, {
        tenantId,
        oldTask,
        trx,
      } as ITaskDeletedEventPayload);
    });
  };
}
