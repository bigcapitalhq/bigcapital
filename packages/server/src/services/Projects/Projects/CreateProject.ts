import {
  type IProjectCreateDTO,
  type IProjectCreatePOJO,
  type IProjectCreatedEventPayload,
  type IProjectCreatingEventPayload,
  IProjectStatus,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ProjectsValidator } from './ProjectsValidator';

@Service()
export default class CreateProject {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private validator: ProjectsValidator;

  /**
   * Creates a new credit note.
   * @param {IProjectCreateDTO} creditNoteDTO
   */
  public createProject = async (tenantId: number, projectDTO: IProjectCreateDTO): Promise<IProjectCreatePOJO> => {
    const { Project } = this.tenancy.models(tenantId);

    // Validate customer existance.
    await this.validator.validateContactExists(tenantId, projectDTO.contactId);

    // Triggers `onProjectCreate` event.
    await this.eventPublisher.emitAsync(events.project.onCreate, {
      tenantId,
      projectDTO,
    } as IProjectCreatedEventPayload);

    // Creates a new project under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectCreating` event.
      await this.eventPublisher.emitAsync(events.project.onCreating, {
        tenantId,
        projectDTO,
        trx,
      } as IProjectCreatingEventPayload);

      // Upsert the project object.
      const project = await Project.query(trx).upsertGraph({
        ...projectDTO,
        status: IProjectStatus.InProgress,
      });
      // Triggers `onProjectCreated` event.
      await this.eventPublisher.emitAsync(events.project.onCreated, {
        tenantId,
        projectDTO,
        project,
        trx,
      } as IProjectCreatedEventPayload);

      return project;
    });
  };
}
