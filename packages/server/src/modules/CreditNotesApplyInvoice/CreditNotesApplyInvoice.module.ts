import { forwardRef, Module } from '@nestjs/common';
import { DeleteCustomerLinkedCreditNoteService } from './commands/DeleteCustomerLinkedCreditNote.service';
import { DeleteCreditNoteApplyToInvoices } from './commands/DeleteCreditNoteApplyToInvoices.service';
import { CreditNoteApplyToInvoices } from './commands/CreditNoteApplyToInvoices.service';
import { CreditNoteApplySyncInvoicesCreditedAmount } from './commands/CreditNoteApplySyncInvoices.service';
import { CreditNoteApplySyncCredit } from './commands/CreditNoteApplySyncCredit.service';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { CreditNotesModule } from '../CreditNotes/CreditNotes.module';
import { GetCreditNoteAssociatedAppliedInvoices } from './queries/GetCreditNoteAssociatedAppliedInvoices.service';
import { GetCreditNoteAssociatedInvoicesToApply } from './queries/GetCreditNoteAssociatedInvoicesToApply.service';

@Module({
  providers: [
    DeleteCustomerLinkedCreditNoteService,
    DeleteCreditNoteApplyToInvoices,
    CreditNoteApplyToInvoices,
    CreditNoteApplySyncInvoicesCreditedAmount,
    CreditNoteApplySyncCredit,
    // GetCreditNoteAssociatedAppliedInvoices,
    // GetCreditNoteAssociatedInvoicesToApply
  ],
  exports: [
    DeleteCustomerLinkedCreditNoteService,
  ],
  imports: [PaymentsReceivedModule, forwardRef(() => CreditNotesModule)],
})
export class CreditNotesApplyInvoiceModule {}
