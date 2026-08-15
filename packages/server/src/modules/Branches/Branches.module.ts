import { Module } from '@nestjs/common';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { BranchesController } from './Branches.controller';
import { CreateBranchService } from './commands/CreateBranch.service';
import { DeleteBranchService } from './commands/DeleteBranch.service';
import { EditBranchService } from './commands/EditBranch.service';
import { MarkBranchAsPrimaryService } from './commands/MarkBranchAsPrimary.service';
import { GetBranchService } from './queries/GetBranch.service';
import { GetBranchesService } from './queries/GetBranches.service';
import { ActivateBranches } from './commands/ActivateBranchesFeature.service';
import { BranchesApplication } from './BranchesApplication.service';
import { BranchesSettingsService } from './BranchesSettings';
import { BranchCommandValidator } from './commands/BranchCommandValidator.service';
import { BranchTransactionDTOTransformer } from './integrations/BranchTransactionDTOTransform';
import { ManualJournalBranchesDTOTransformer } from './integrations/ManualJournals/ManualJournalDTOTransformer.service';
import { BillBranchValidateSubscriber } from './subscribers/Validators/BillBranchSubscriber';
import { InventoryAdjustmentBranchValidateSubscriber } from './subscribers/Validators/InventoryAdjustmentBranchValidatorSubscriber';
import { ExpenseBranchValidateSubscriber } from './subscribers/Validators/ExpenseBranchSubscriber';
import { CreditNoteBranchValidateSubscriber } from './subscribers/Validators/CreditNoteBranchesSubscriber';
import { CreditNoteRefundBranchValidateSubscriber } from './subscribers/Validators/CreditNoteRefundBranchSubscriber';
import { ContactBranchValidateSubscriber } from './subscribers/Validators/ContactOpeningBalanceBranchSubscriber';
import { ManualJournalBranchValidateSubscriber } from './subscribers/Validators/ManualJournalBranchSubscriber';
import { SaleEstimateBranchValidateSubscriber } from './subscribers/Validators/SaleEstimateMultiBranchesSubscriber';
import { PaymentMadeBranchValidateSubscriber } from './subscribers/Validators/PaymentMadeBranchSubscriber';
import { PaymentReceiveBranchValidateSubscriber } from './subscribers/Validators/PaymentReceiveBranchSubscriber';
import { SaleReceiptBranchValidateSubscriber } from './subscribers/Validators/SaleReceiptBranchesSubscriber';
import { VendorCreditBranchValidateSubscriber } from './subscribers/Validators/VendorCreditBranchSubscriber';
import { ValidateBranchExistance } from './integrations/ValidateBranchExistance';
import { ManualJournalBranchesValidator } from './integrations/ManualJournals/ManualJournalsBranchesValidator';
import { CashflowTransactionsActivateBranches } from './integrations/Cashflow/CashflowActivateBranches';
import { ExpensesActivateBranches } from './integrations/Expense/ExpensesActivateBranches';
import { BillActivateBranches } from './integrations/Purchases/BillBranchesActivate';
import { VendorCreditActivateBranches } from './integrations/Purchases/VendorCreditBranchesActivate';
import { BillPaymentsActivateBranches } from './integrations/Purchases/PaymentMadeBranchesActivate';
import { SaleInvoiceActivateBranches } from './integrations/Sales/SaleInvoiceBranchesActivate';
import { SaleReceiptActivateBranches } from './integrations/Sales/SaleReceiptBranchesActivate';
import { SaleEstimateActivateBranches } from './integrations/Sales/SaleEstimatesBranchesActivate';
import { PaymentReceiveActivateBranches } from './integrations/Sales/PaymentReceiveBranchesActivate';
import { CreditNoteActivateBranches } from './integrations/Sales/CreditNoteBranchesActivate';
import { BillBranchesActivateSubscriber } from './subscribers/Activate/BillBranchesActivateSubscriber';
import { VendorCreditBranchesActivateSubscriber } from './subscribers/Activate/VendorCreditBranchesActivateSubscriber';
import { PaymentMadeActivateBranchesSubscriber } from './subscribers/Activate/PaymentMadeBranchesActivateSubscriber';
import { CashflowActivateBranchesSubscriber } from './subscribers/Activate/CashflowBranchesActivateSubscriber';
import { CreditNoteActivateBranchesSubscriber } from './subscribers/Activate/CreditNoteBranchesActivateSubscriber';
import { ExpenseActivateBranchesSubscriber } from './subscribers/Activate/ExpenseBranchesActivateSubscriber';
import { PaymentReceiveActivateBranchesSubscriber } from './subscribers/Activate/PaymentReceiveBranchesActivateSubscriber';
import { SaleEstimatesActivateBranchesSubscriber } from './subscribers/Activate/SaleEstiamtesBranchesActivateSubscriber';
import { SaleInvoicesActivateBranchesSubscriber } from './subscribers/Activate/SaleInvoiceBranchesActivateSubscriber';
import { SaleReceiptsActivateBranchesSubscriber } from './subscribers/Activate/SaleReceiptsBranchesActivateSubscriber';
import { FeaturesModule } from '../Features/Features.module';

@Module({
  imports: [TenancyModule, TenancyDatabaseModule, FeaturesModule],
  controllers: [BranchesController],
  providers: [
    CreateBranchService,
    EditBranchService,
    DeleteBranchService,
    GetBranchService,
    GetBranchesService,
    MarkBranchAsPrimaryService,
    ActivateBranches,
    BranchesApplication,
    BranchesSettingsService,
    BranchCommandValidator,
    BranchTransactionDTOTransformer,
    ManualJournalBranchesDTOTransformer,
    BillBranchValidateSubscriber,
    CreditNoteBranchValidateSubscriber,
    CreditNoteRefundBranchValidateSubscriber,
    ContactBranchValidateSubscriber,
    ExpenseBranchValidateSubscriber,
    InventoryAdjustmentBranchValidateSubscriber,
    ManualJournalBranchValidateSubscriber,
    PaymentMadeBranchValidateSubscriber,
    PaymentReceiveBranchValidateSubscriber,
    SaleEstimateBranchValidateSubscriber,
    SaleReceiptBranchValidateSubscriber,
    VendorCreditBranchValidateSubscriber,
    ValidateBranchExistance,
    ManualJournalBranchesValidator,
    CashflowTransactionsActivateBranches,
    ExpensesActivateBranches,
    BillActivateBranches,
    VendorCreditActivateBranches,
    BillPaymentsActivateBranches,
    SaleInvoiceActivateBranches,
    SaleReceiptActivateBranches,
    SaleEstimateActivateBranches,
    PaymentReceiveActivateBranches,
    CreditNoteActivateBranches,
    BillBranchesActivateSubscriber,
    VendorCreditBranchesActivateSubscriber,
    PaymentMadeActivateBranchesSubscriber,
    CashflowActivateBranchesSubscriber,
    CreditNoteActivateBranchesSubscriber,
    ExpenseActivateBranchesSubscriber,
    PaymentReceiveActivateBranchesSubscriber,
    SaleEstimatesActivateBranchesSubscriber,
    SaleInvoicesActivateBranchesSubscriber,
    SaleReceiptsActivateBranchesSubscriber,
  ],
  exports: [
    BranchesSettingsService,
    BranchTransactionDTOTransformer,
    ManualJournalBranchesDTOTransformer,
  ],
})
export class BranchesModule {}
