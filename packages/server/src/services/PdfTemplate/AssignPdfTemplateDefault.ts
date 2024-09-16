import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class AssignPdfTemplateDefault {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Assigns a default PDF template for a specific tenant.
   * @param {number} tenantId - The ID of the tenant for whom the default template is being assigned.
   * @param {number} templateId - The ID of the template to be set as the default.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} Throws ddan error if the specified template is not found.
   */
  public async assignDefaultTemplate(tenantId: number, templateId: number) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const oldPdfTempalte = await PdfTemplate.query()
      .findById(templateId)
      .throwIfNotFound();

    return this.uow.withTransaction(
      tenantId,
      async (trx?: Knex.Transaction) => {
        // Triggers `onPdfTemplateAssigningDefault` event.
        await this.eventPublisher.emitAsync(
          events.pdfTemplate.onAssigningDefault,
          {
            tenantId,
            templateId,
          }
        );
        await PdfTemplate.query(trx)
          .where('resource', oldPdfTempalte.resource)
          .patch({ default: false });

        await PdfTemplate.query(trx)
          .findById(templateId)
          .patch({ default: true });

        // Triggers `onPdfTemplateAssignedDefault` event.
        await this.eventPublisher.emitAsync(
          events.pdfTemplate.onAssignedDefault,
          {
            tenantId,
            templateId,
          }
        );
      }
    );
  }
}
