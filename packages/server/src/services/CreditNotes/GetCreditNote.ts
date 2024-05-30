import { ServiceError } from '@/exceptions';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';
import BaseCreditNotes from './CreditNotes';
import { CreditNoteTransformer } from './CreditNoteTransformer';

@Service()
export default class GetCreditNote extends BaseCreditNotes {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns
   */
  public getCreditNote = async (tenantId: number, creditNoteId: number) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    // Retrieve the vendor credit model graph.
    const creditNote = await CreditNote.query()
      .findById(creditNoteId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch')
      .withGraphFetched('attachments');

    if (!creditNote) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_NOT_FOUND);
    }
    // Transforms the credit note model to POJO.
    return this.transformer.transform(
      tenantId,
      creditNote,
      new CreditNoteTransformer(),
    );
  };
}
