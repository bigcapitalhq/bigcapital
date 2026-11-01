import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreditNote } from '../models/CreditNote';
import { SendCreditNoteMail } from '../commands/SendCreditNoteMail';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetCreditNoteMailStateTransformer } from './GetCreditNoteMailState.transformer';

@Injectable()
export class GetCreditNoteMailStateService {
  constructor(
    private readonly creditNoteMail: SendCreditNoteMail,
    private readonly transformer: TransformerInjectable,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Retrieves the credit note mail state of the given credit note.
   * Credit note mail state includes the mail options, branding attributes and the credit note details.
   * @param {number} creditNoteId
   * @returns {Promise<CreditNoteMailState>}
   */
  async getCreditNoteMailState(creditNoteId: number) {
    const creditNote = await this.creditNoteModel()
      .query()
      .findById(creditNoteId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.item')
      .withGraphFetched('pdfTemplate')
      .throwIfNotFound();

    const mailOptions = await this.creditNoteMail.getMailOptions(creditNoteId);
    const transformed = await this.transformer.transform(
      creditNote,
      new GetCreditNoteMailStateTransformer(),
      {
        mailOptions,
      },
    );
    return transformed;
  }
}
