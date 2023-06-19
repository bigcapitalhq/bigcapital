import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  IEditTaskDTO,
  IProjectTaskEditPOJO,
  ITaskEditedEventPayload,
  ITaskEditEventPayload,
  ITaskEditingEventPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class EditTaskService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Edits a new credit note.
   * @param {number} tenantId -
   * @param {number} taskId -
   * @param {IEditTaskDTO} taskDTO -
   * @returns {IProjectTaskEditPOJO}
   */
  public editTask = async (
    tenantId: number,
    taskId: number,
    taskDTO: IEditTaskDTO
  ): Promise<IProjectTaskEditPOJO> => {
    const { Task } = this.tenancy.models(tenantId);

    // Validate task existence.
    const oldTask = await Task.query().findById(taskId).throwIfNotFound();

    // Triggers `onProjectTaskEdit` event.
    await this.eventPublisher.emitAsync(events.projectTask.onEdit, {
      tenantId,
      taskId,
      taskDTO,
    } as ITaskEditEventPayload);

    // Edits the given project under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectTaskEditing` event.
      await this.eventPublisher.emitAsync(events.projectTask.onEditing, {
        tenantId,
        oldTask,
        taskDTO,
        trx,
      } as ITaskEditingEventPayload);

      // Upsert the project's task object.
      const task = await Task.query(trx).upsertGraph({
        id: taskId,
        ...taskDTO,
      });
      // Triggers `onProjectTaskEdited` event.
      await this.eventPublisher.emitAsync(events.projectTask.onEdited, {
        tenantId,
        oldTask,
        taskDTO,
        task,
        trx,
      } as ITaskEditedEventPayload);

      return task;
    });
  };
}
