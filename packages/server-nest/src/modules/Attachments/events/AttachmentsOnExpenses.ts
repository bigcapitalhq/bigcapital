import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IExpenseCreatedPayload,
  IExpenseCreatingPayload,
  IExpenseDeletingPayload,
  IExpenseEventEditPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnExpenses {
  @Inject()
  private linkAttachmentService: LinkAttachment;

  @Inject()
  private unlinkAttachmentService: UnlinkAttachment;

  @Inject()
  private validateDocuments: ValidateAttachments;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.expenses.onCreating,
      this.validateAttachmentsOnExpenseCreate.bind(this)
    );
    bus.subscribe(
      events.expenses.onCreated,
      this.handleAttachmentsOnExpenseCreated.bind(this)
    );
    bus.subscribe(
      events.expenses.onEdited,
      this.handleUnlinkUnpresentedKeysOnExpenseEdited.bind(this)
    );
    bus.subscribe(
      events.expenses.onEdited,
      this.handleLinkPresentedKeysOnExpenseEdited.bind(this)
    );
    bus.subscribe(
      events.expenses.onDeleting,
      this.handleUnlinkAttachmentsOnExpenseDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating expense.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnExpenseCreate({
    expenseDTO,
    tenantId,
  }: IExpenseCreatingPayload): Promise<void> {
    if (isEmpty(expenseDTO.attachments)) {
      return;
    }
    const documentKeys = expenseDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created expense.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnExpenseCreated({
    tenantId,
    expenseDTO,
    expense,
    trx,
  }: IExpenseCreatedPayload): Promise<void> {
    if (isEmpty(expenseDTO.attachments)) return;

    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'Expense',
      expense.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited expense.
   * @param {ISaleInvoiceEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnExpenseEdited({
    tenantId,
    expenseDTO,
    expense,
    trx,
  }: IExpenseEventEditPayload) {
    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'Expense',
      expense.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited expense.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnExpenseEdited({
    tenantId,
    expenseDTO,
    oldExpense,
    trx,
  }: IExpenseEventEditPayload) {
    if (isEmpty(expenseDTO.attachments)) return;

    const keys = expenseDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'Expense',
      oldExpense.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the expense deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnExpenseDeleted({
    tenantId,
    oldExpense,
    trx,
  }: IExpenseDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'Expense',
      oldExpense.id,
      trx
    );
  }
}
