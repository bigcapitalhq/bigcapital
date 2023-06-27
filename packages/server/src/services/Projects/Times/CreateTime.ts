import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  IProjectTimeCreatedEventPayload,
  IProjectTimeCreateDTO,
  IProjectTimeCreateEventPayload,
  IProjectTimeCreatePOJO,
  IProjectTimeCreatingEventPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class CreateTimeService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a new time.
   * @param {number} taskId -
   * @param {IProjectTimeCreateDTO} timeDTO -
   * @returns {Promise<IProjectTimeCreatePOJO>}
   */
  public createTime = async (
    tenantId: number,
    taskId: number,
    timeDTO: IProjectTimeCreateDTO
  ): Promise<IProjectTimeCreatePOJO> => {
    const { Time, Task } = this.tenancy.models(tenantId);

    const task = await Task.query().findById(taskId).throwIfNotFound();

    // Triggers `onProjectTimeCreate` event.
    await this.eventPublisher.emitAsync(events.projectTime.onCreate, {
      tenantId,
      timeDTO,
    } as IProjectTimeCreateEventPayload);

    // Creates a new project under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectTimeCreating` event.
      await this.eventPublisher.emitAsync(events.projectTime.onCreating, {
        tenantId,
        timeDTO,
        trx,
      } as IProjectTimeCreatingEventPayload);

      const time = await Time.query().insert({
        ...timeDTO,
        taskId,
        projectId: task.projectId,
      });

      // Triggers `onProjectTimeCreated` event.
      await this.eventPublisher.emitAsync(events.projectTime.onCreated, {
        tenantId,
        time,
        trx,
      } as IProjectTimeCreatedEventPayload);

      return time;
    });
  };
}
