import { Service, Inject } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { Knex } from 'knex';
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

  public async assignDefaultTemplate(tenantId: number, templateId: number) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const oldPdfTempalte = await PdfTemplate.query()
      .findById(templateId)
      .throwIfNotFound();

    return this.uow.withTransaction(
      tenantId,
      async (trx?: Knex.Transaction) => {
        await PdfTemplate.query(trx)
          .where('resource', oldPdfTempalte.resource)
          .patch({ default: false });

        await PdfTemplate.query(trx)
          .findById(templateId)
          .patch({ default: true });

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
