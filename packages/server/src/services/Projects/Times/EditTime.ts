import {
  IProjectTimeEditDTO,
  IProjectTimeEditEventPayload,
  IProjectTimeEditPOJO,
  IProjectTimeEditedEventPayload,
  IProjectTimeEditingEventPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class EditTimeService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Edits the given project's time that associated to the given task.
   * @param {number} tenantId - Tenant id.
   * @param {number} taskId - Task id.
   * @returns {Promise<IProjectTimeEditPOJO>}
   */
  public editTime = async (
    tenantId: number,
    timeId: number,
    timeDTO: IProjectTimeEditDTO,
  ): Promise<IProjectTimeEditPOJO> => {
    const { Time } = this.tenancy.models(tenantId);

    // Validate customer existance.
    const oldTime = await Time.query().findById(timeId).throwIfNotFound();

    // Triggers `onProjectEdit` event.
    await this.eventPublisher.emitAsync(events.projectTime.onEdit, {
      tenantId,
      oldTime,
      timeDTO,
    } as IProjectTimeEditEventPayload);

    // Edits the given project under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectEditing` event.
      await this.eventPublisher.emitAsync(events.projectTime.onEditing, {
        tenantId,
        timeDTO,
        oldTime,
        trx,
      } as IProjectTimeEditingEventPayload);

      // Upsert the task's time object.
      const time = await Time.query(trx).upsertGraphAndFetch({
        id: timeId,
        ...timeDTO,
      });
      // Triggers `onProjectEdited` event.
      await this.eventPublisher.emitAsync(events.projectTime.onEdited, {
        tenantId,
        oldTime,
        timeDTO,
        time,
        trx,
      } as IProjectTimeEditedEventPayload);

      return time;
    });
  };
}
