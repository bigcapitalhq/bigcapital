import Agenda from 'agenda';
import ResetPasswordMailJob from 'jobs/ResetPasswordMail';
import ComputeItemCost from 'jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from 'jobs/WriteInvoicesJEntries';
import UserInviteMailJob from 'jobs/UserInviteMail';
import OrganizationSetupJob from 'jobs/OrganizationSetup';
import OrganizationUpgrade from 'jobs/OrganizationUpgrade';
import { SendSaleInvoiceMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailJob';
import { SendSaleInvoiceReminderMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailReminderJob';
import { SendSaleEstimateMailJob } from '@/services/Sales/Estimates/SendSaleEstimateMailJob';
import { SaleReceiptMailNotificationJob } from '@/services/Sales/Receipts/SaleReceiptMailNotificationJob';
import { PaymentReceivedMailNotificationJob } from '@/services/Sales/PaymentReceived/PaymentReceivedMailNotificationJob';
import { PlaidFetchTransactionsJob } from '@/services/Banking/Plaid/PlaidFetchTransactionsJob';
import { ImportDeleteExpiredFilesJobs } from '@/services/Import/jobs/ImportDeleteExpiredFilesJob';
import { SendVerifyMailJob } from '@/services/Authentication/jobs/SendVerifyMailJob';
import { ReregonizeTransactionsJob } from '@/services/Banking/RegonizeTranasctions/jobs/RerecognizeTransactionsJob';
import { RegonizeTransactionsJob } from '@/services/Banking/RegonizeTranasctions/jobs/RecognizeTransactionsJob';
import { RevertRegonizeTransactionsJob } from '@/services/Banking/RegonizeTranasctions/jobs/RevertRecognizedTransactionsJob';

export default ({ agenda }: { agenda: Agenda }) => {
  new ResetPasswordMailJob(agenda);
  new UserInviteMailJob(agenda);
  new ComputeItemCost(agenda);
  new RewriteInvoicesJournalEntries(agenda);
  new OrganizationSetupJob(agenda);
  new OrganizationUpgrade(agenda);
  new SendSaleInvoiceMailJob(agenda);
  new SendSaleInvoiceReminderMailJob(agenda);
  new SendSaleEstimateMailJob(agenda);
  new SaleReceiptMailNotificationJob(agenda);
  new PaymentReceivedMailNotificationJob(agenda);
  new PlaidFetchTransactionsJob(agenda);
  new ImportDeleteExpiredFilesJobs(agenda);
  new SendVerifyMailJob(agenda);
  new RegonizeTransactionsJob(agenda);
  new ReregonizeTransactionsJob(agenda);
  new RevertRegonizeTransactionsJob(agenda);

  agenda.start().then(() => {
    agenda.every('1 hours', 'delete-expired-imported-files', {});
  });
};
