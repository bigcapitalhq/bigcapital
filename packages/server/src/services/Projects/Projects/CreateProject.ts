import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  IProjectCreatedEventPayload,
  IProjectCreateDTO,
  IProjectCreatePOJO,
  IProjectCreatingEventPayload,
  IProjectStatus,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { ProjectsValidator } from './ProjectsValidator';
import events from '@/subscribers/events';

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
  public createProject = async (
    tenantId: number,
    projectDTO: IProjectCreateDTO
  ): Promise<IProjectCreatePOJO> => {
    const { Project } = this.tenancy.models(tenantId);

    // Validate customer existence.
    await this.validator.validateContactExists(tenantId, projectDTO.contactId);

    // Triggers `onProjectCreate` event.
    await this.eventPublisher.emitAsync(events.project.onCreate, {
      tenantId,
      projectDTO,
    } as IProjectCreatedEventPayload);

    // Creates a new project under unit-of-work environment.
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
