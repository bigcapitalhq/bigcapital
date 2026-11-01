import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import {
  renderCreditNoteEmailTemplate,
  CreditNoteEmailProps,
} from '@bigcapital/email-components';
import { Inject, Injectable } from '@nestjs/common';
import { GetCreditNoteService } from './GetCreditNote.service';
import { CreditNoteBrandingTemplate } from './CreditNoteBrandingTemplate.service';
import { GetCreditNoteMailTemplateAttributesTransformer } from './GetCreditNoteMailTemplateAttributes.transformer';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetCreditNoteMailTemplateService {
  constructor(
    private readonly getCreditNoteService: GetCreditNoteService,
    private readonly transformer: TransformerInjectable,
    private readonly creditNoteBrandingTemplate: CreditNoteBrandingTemplate,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
  ) {}

  /**
   * Retrieves the mail template attributes of the given credit note.
   * Credit note template attributes are composed of the credit note and branding template attributes.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<CreditNoteEmailProps>}
   */
  public async getMailTemplateAttributes(
    creditNoteId: number,
  ): Promise<CreditNoteEmailProps> {
    const creditNote =
      await this.getCreditNoteService.getCreditNote(creditNoteId);

    // Retrieves the credit note branding template of the assigned template
    // id or the default template of the resource.
    const templateId =
      creditNote.pdfTemplateId ??
      (
        await this.pdfTemplateModel().query().findOne({
          resource: 'CreditNote',
          default: true,
        })
      )?.id;
    const brandingTemplate =
      await this.creditNoteBrandingTemplate.getCreditNoteBrandingTemplate(
        templateId,
      );

    const mailTemplateAttributes = await this.transformer.transform(
      creditNote,
      new GetCreditNoteMailTemplateAttributesTransformer(),
      {
        creditNote,
        brandingTemplate,
      },
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content of the given credit note.
   * @param {number} creditNoteId
   * @param {Partial<CreditNoteEmailProps>} overrideAttributes
   * @returns {Promise<string>}
   */
  public async getMailTemplate(
    creditNoteId: number,
    overrideAttributes?: Partial<CreditNoteEmailProps>,
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(creditNoteId);
    const mergedAttributes = {
      ...attributes,
      ...overrideAttributes,
    };
    return renderCreditNoteEmailTemplate(mergedAttributes);
  }
}
