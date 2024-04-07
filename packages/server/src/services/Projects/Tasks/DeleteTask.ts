import { ITaskDeleteEventPayload, ITaskDeletedEventPayload, ITaskDeletingEventPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

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
  public deleteTask = async (tenantId: number, taskId: number): Promise<void> => {
    const { Task } = this.tenancy.models(tenantId);

    // Validate customer existance.
    const oldTask = await Task.query().findById(taskId).throwIfNotFound();

    // Triggers `onDeleteProjectTask` event.
    await this.eventPublisher.emitAsync(events.projectTask.onDelete, {
      tenantId,
      taskId,
    } as ITaskDeleteEventPayload);

    // Deletes the given project under unit-of-work envirement.
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
