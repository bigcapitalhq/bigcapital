import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { ERRORS } from '../RecurringInvoice.types';
import { RecurringInvoiceTransformer } from './RecurringInvoice.transformer';

@Injectable()
export class GetRecurringInvoice {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,
  ) {}

  /**
   * Retrieves the recurring invoice profile graph.
   */
  public async getRecurringInvoice(recurringInvoiceId: number) {
    const recurringInvoice = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('warehouse')
      .withGraphFetched('pdfTemplate');

    if (!recurringInvoice) {
      throw new ServiceError(ERRORS.RECURRING_INVOICE_NOT_FOUND);
    }

    return this.transformer.transform(
      recurringInvoice,
      new RecurringInvoiceTransformer(),
    );
  }
}
