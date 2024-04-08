import {
  ICreateTaskDTO,
  IProjectTaskCreatePOJO,
  ITaskCreateEventPayload,
  ITaskCreatedEventPayload,
  ITaskCreatingEventPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class CreateTaskService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a new task.
   * @param {number} tenantId -
   * @param {number} projectId - Project id.
   * @param {ICreateTaskDTO} taskDTO - Project's task DTO.
   * @returns {Promise<IProjectTaskCreatePOJO>}
   */
  public createTask = async (
    tenantId: number,
    projectId: number,
    taskDTO: ICreateTaskDTO,
  ): Promise<IProjectTaskCreatePOJO> => {
    const { Task, Project } = this.tenancy.models(tenantId);

    // Validate project existance.
    const project = await Project.query().findById(projectId).throwIfNotFound();

    // Triggers `onProjectTaskCreate` event.
    await this.eventPublisher.emitAsync(events.projectTask.onCreate, {
      tenantId,
      taskDTO,
    } as ITaskCreateEventPayload);

    // Creates a new project under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectTaskCreating` event.
      await this.eventPublisher.emitAsync(events.projectTask.onCreating, {
        tenantId,
        taskDTO,
        trx,
      } as ITaskCreatingEventPayload);

      const task = await Task.query().insert({
        ...taskDTO,
        actualHours: 0,
        projectId,
      });
      // Triggers `onProjectTaskCreated` event.
      await this.eventPublisher.emitAsync(events.projectTask.onCreated, {
        tenantId,
        taskDTO,
        task,
        trx,
      } as ITaskCreatedEventPayload);

      return task;
    });
  };
}
