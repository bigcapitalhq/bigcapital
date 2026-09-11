import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactMailNotification } from '@/modules/MailNotification/ContactMailNotification';
import {
  DEFAULT_CREDIT_NOTE_MAIL_SUBJECT,
  DEFAULT_CREDIT_NOTE_MAIL_CONTENT,
} from '../constants';
import { GetCreditNoteService } from '../queries/GetCreditNote.service';
import { transformCreditNoteToMailDataArgs } from '../utils';
import { GetCreditNotePdf } from '../queries/GetCreditNotePdf.serivce';
import { events } from '@/common/events/events';
import { CreditNote } from '../models/CreditNote';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import {
  CreditNoteMailOptions,
  CreditNoteMailOptionsDTO,
  ICreditNoteMailPresendEvent,
  SendCreditNoteMailJob,
  SendCreditNoteMailQueue,
} from '../types/CreditNotes.types';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetCreditNoteMailTemplateService } from '../queries/GetCreditNoteMailTemplate.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class SendCreditNoteMail {
  /**
   * @param {GetCreditNotePdf} creditNotePdf - Credit note pdf service.
   * @param {GetCreditNoteService} getCreditNoteService - Get credit note service.
   * @param {ContactMailNotification} contactMailNotification - Contact mail notification service.
   * @param {GetCreditNoteMailTemplateService} getCreditNoteMailTemplate - Credit note mail template service.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {MailTransporter} mailTransporter - Mail transporter service.
   * @param {TenancyContext} tenancyContext - Tenancy context service.
   * @param {typeof CreditNote} creditNoteModel - Credit note model.
   */
  constructor(
    private readonly creditNotePdf: GetCreditNotePdf,
    private readonly getCreditNoteService: GetCreditNoteService,
    private readonly contactMailNotification: ContactMailNotification,
    private readonly getCreditNoteMailTemplate: GetCreditNoteMailTemplateService,
    private readonly eventPublisher: EventEmitter2,
    private readonly mailTransporter: MailTransporter,
    private readonly tenancyContext: TenancyContext,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,

    @InjectQueue(SendCreditNoteMailQueue)
    private readonly sendCreditNoteMailQueue: Queue,
  ) {}

  /**
   * Triggers the mail of the given credit note.
   * @param {number} creditNoteId - Credit note id.
   * @param {CreditNoteMailOptionsDTO} messageOptions - Credit note mail options.
   * @returns {Promise<void>}
   */
  public async triggerMail(
    creditNoteId: number,
    messageOptions: CreditNoteMailOptionsDTO,
  ): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    const organizationId = tenant.organizationId;
    const userId = user.id;

    const payload = {
      creditNoteId,
      messageOptions,
      userId,
      organizationId,
    };

    await this.sendCreditNoteMailQueue.add(SendCreditNoteMailJob, payload);

    // Triggers `onCreditNotePreMailSend` event.
    await this.eventPublisher.emitAsync(events.creditNote.onPreMailSend, {
      creditNoteId,
      messageOptions,
    } as ICreditNoteMailPresendEvent);
  }

  /**
   * Formate the text of the mail.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<Record<string, any>>}
   */
  public formatterArgs = async (creditNoteId: number) => {
    const creditNote =
      await this.getCreditNoteService.getCreditNote(creditNoteId);
    const commonArgs = await this.contactMailNotification.getCommonFormatArgs();

    return {
      ...commonArgs,
      ...transformCreditNoteToMailDataArgs(creditNote),
    };
  };

  /**
   * Retrieves the mail options.
   * @param {number} creditNoteId - Credit note id.
   * @param {string} defaultSubject - Default subject.
   * @param {string} defaultMessage - Default message.
   * @returns {Promise<CreditNoteMailOptions>}
   */
  public getMailOptions = async (
    creditNoteId: number,
    defaultSubject: string = DEFAULT_CREDIT_NOTE_MAIL_SUBJECT,
    defaultMessage: string = DEFAULT_CREDIT_NOTE_MAIL_CONTENT,
  ): Promise<CreditNoteMailOptions> => {
    const creditNote = await this.creditNoteModel()
      .query()
      .findById(creditNoteId)
      .throwIfNotFound();

    const formatArgs = await this.formatterArgs(creditNoteId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        creditNote.customerId,
      );
    return {
      ...mailOptions,
      message: defaultMessage,
      subject: defaultSubject,
      attachPdf: true,
      formatArgs,
    };
  };

  /**
   * Formats the given mail options.
   * @param {number} creditNoteId - Credit note id.
   * @param {CreditNoteMailOptions} mailOptions - Credit note mail options.
   * @returns {Promise<CreditNoteMailOptions>}
   */
  public formatMailOptions = async (
    creditNoteId: number,
    mailOptions: CreditNoteMailOptions,
  ): Promise<CreditNoteMailOptions> => {
    const formatterArgs = await this.formatterArgs(creditNoteId);
    const formattedOptions =
      await this.contactMailNotification.formatMailOptions(
        mailOptions,
        formatterArgs,
      );
    // Retrieves the credit note mail template.
    const message = await this.getCreditNoteMailTemplate.getMailTemplate(
      creditNoteId,
      {
        message: formattedOptions.message,
        preview: formattedOptions.message,
      },
    );
    return { ...formattedOptions, message };
  };

  /**
   * Retrieves the formatted mail options.
   * @param {number} creditNoteId
   * @param {CreditNoteMailOptionsDTO} messageOptions
   * @returns {Promise<CreditNoteMailOptions>}
   */
  public async getFormattedMailOptions(
    creditNoteId: number,
    messageOptions: CreditNoteMailOptionsDTO,
  ): Promise<CreditNoteMailOptions> {
    const defaultMessageOptions = await this.getMailOptions(creditNoteId);
    const parsedMessageOptions = mergeAndValidateMailOptions(
      defaultMessageOptions,
      messageOptions,
    );
    return this.formatMailOptions(creditNoteId, parsedMessageOptions);
  }

  /**
   * Sends the mail notification of the given credit note.
   * @param {number} creditNoteId - Credit note id.
   * @param {CreditNoteMailOptionsDTO} messageOptions - Credit note mail options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    creditNoteId: number,
    messageOptions: CreditNoteMailOptionsDTO,
  ): Promise<void> {
    const formattedOptions = await this.getFormattedMailOptions(
      creditNoteId,
      messageOptions,
    );
    const mail = new Mail()
      .setSubject(formattedOptions.subject)
      .setTo(formattedOptions.to)
      .setCC(formattedOptions.cc)
      .setBCC(formattedOptions.bcc)
      .setContent(formattedOptions.message);

    // Attaches the credit note pdf to the mail.
    if (formattedOptions.attachPdf) {
      // Retrieves the credit note pdf and attaches it to the mail.
      const [creditNotePdfBuffer, creditNoteFilename] =
        await this.creditNotePdf.getCreditNotePdf(creditNoteId);

      mail.setAttachments([
        {
          filename: `${creditNoteFilename}.pdf`,
          content: creditNotePdfBuffer,
        },
      ]);
    }
    const eventPayload = {
      creditNoteId,
      messageOptions,
      formattedOptions,
    };
    // Triggers `onCreditNoteMailSend` event.
    await this.eventPublisher.emitAsync(
      events.creditNote.onMailSend,
      eventPayload as ICreditNoteMailPresendEvent,
    );
    await this.mailTransporter.send(mail);

    // Triggers `onCreditNoteMailSent` event.
    await this.eventPublisher.emitAsync(
      events.creditNote.onMailSent,
      eventPayload as ICreditNoteMailPresendEvent,
    );
  }
}
