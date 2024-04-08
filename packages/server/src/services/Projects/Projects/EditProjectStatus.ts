import { IProjectStatus } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export default class EditProjectStatusService {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Edits a new credit note.
   * @param {number} projectId -
   * @param {IProjectStatus} status -
   */
  public editProjectStatus = async (tenantId: number, projectId: number, status: IProjectStatus) => {
    const { Project } = this.tenancy.models(tenantId);

    // Validate customer existance.
    const oldProject = await Project.query().findById(projectId).throwIfNotFound();

    // Edits the given project under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Upsert the project object.
      const project = await Project.query(trx).upsertGraph({
        id: projectId,
        status,
      });
      return project;
    });
  };
}
