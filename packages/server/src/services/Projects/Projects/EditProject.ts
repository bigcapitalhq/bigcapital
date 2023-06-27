import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  IProjectEditDTO,
  IProjectEditedEventPayload,
  IProjectEditEventPayload,
  IProjectEditingEventPayload,
  IProjectEditPOJO,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { ProjectsValidator } from './ProjectsValidator';

@Service()
export default class EditProjectService {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private projectsValidator: ProjectsValidator;

  /**
   * Edits a new credit note.
   * @param {number} tenantId -
   * @param {number} projectId -
   * @param {IProjectEditDTO} projectDTO -
   */
  public editProject = async (
    tenantId: number,
    projectId: number,
    projectDTO: IProjectEditDTO
  ): Promise<IProjectEditPOJO> => {
    const { Project } = this.tenancy.models(tenantId);

    // Validate customer existence.
    const oldProject = await Project.query().findById(projectId).throwIfNotFound();

    // Validate the project's contact id existence.
    if (oldProject.contactId !== projectDTO.contactId) {
      await this.projectsValidator.validateContactExists(
        tenantId,
        projectDTO.contactId
      );
    }
    // Triggers `onProjectEdit` event.
    await this.eventPublisher.emitAsync(events.project.onEdit, {
      tenantId,
      oldProject,
      projectDTO,
    } as IProjectEditEventPayload);

    // Edits the given project under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onProjectEditing` event.
      await this.eventPublisher.emitAsync(events.project.onEditing, {
        tenantId,
        projectDTO,
        oldProject,
        trx,
      } as IProjectEditingEventPayload);

      // Upsert the project object.
      const project = await Project.query(trx).upsertGraph({
        id: projectId,
        ...projectDTO,
      });
      // Triggers `onProjectEdited` event.
      await this.eventPublisher.emitAsync(events.project.onEdited, {
        tenantId,
        oldProject,
        project,
        projectDTO,
        trx,
      } as IProjectEditedEventPayload);

      return project;
    });
  };
}
