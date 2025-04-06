import { isEmpty } from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IExpenseCreatedPayload,
  IExpenseCreatingPayload,
  IExpenseDeletingPayload,
  IExpenseEventEditPayload,
} from '@/modules/Expenses/Expenses.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnExpenses {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating expense.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  @OnEvent(events.expenses.onCreating)
  async validateAttachmentsOnExpenseCreate({
    expenseDTO,
  }: IExpenseCreatingPayload): Promise<void> {
    if (isEmpty(expenseDTO.attachments)) {
      return;
    }
    const documentKeys = expenseDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created expense.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.expenses.onCreated)
  async handleAttachmentsOnExpenseCreated({
    expenseDTO,
    expense,
    trx,
  }: IExpenseCreatedPayload): Promise<void> {
    if (isEmpty(expenseDTO.attachments)) return;

    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);

    await this.linkAttachmentService.bulkLink(
      keys,
      'Expense',
      expense.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited expense.
   * @param {ISaleInvoiceEditedPayload}
   */
  @OnEvent(events.expenses.onEdited)
  async handleUnlinkUnpresentedKeysOnExpenseEdited({
    expenseDTO,
    expense,
    trx,
  }: IExpenseEventEditPayload) {
    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'Expense',
      expense.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited expense.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.expenses.onEdited)
  async handleLinkPresentedKeysOnExpenseEdited({
    expenseDTO,
    oldExpense,
    trx,
  }: IExpenseEventEditPayload) {
    if (isEmpty(expenseDTO.attachments)) return;

    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      keys,
      'Expense',
      oldExpense.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the expense deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.expenses.onDeleting)
  async handleUnlinkAttachmentsOnExpenseDeleted({
    oldExpense,
    trx,
  }: IExpenseDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'Expense',
      oldExpense.id,
      trx,
    );
  }
}
