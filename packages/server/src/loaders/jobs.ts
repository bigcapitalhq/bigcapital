import Agenda from 'agenda';
import ResetPasswordMailJob from 'jobs/ResetPasswordMail';
import ComputeItemCost from 'jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from 'jobs/WriteInvoicesJEntries';
import SendSMSNotificationSubscribeEnd from 'jobs/SMSNotificationSubscribeEnd';
import SendSMSNotificationTrialEnd from 'jobs/SMSNotificationTrialEnd';
import SendMailNotificationSubscribeEnd from 'jobs/MailNotificationSubscribeEnd';
import SendMailNotificationTrialEnd from 'jobs/MailNotificationTrialEnd';
import UserInviteMailJob from 'jobs/UserInviteMail';
import OrganizationSetupJob from 'jobs/OrganizationSetup';
import OrganizationUpgrade from 'jobs/OrganizationUpgrade';
import { SendSaleInvoiceMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailJob';
import { SendSaleInvoiceReminderMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailReminderJob';
import { SendSaleEstimateMailJob } from '@/services/Sales/Estimates/SendSaleEstimateMailJob';
import { SaleReceiptMailNotificationJob } from '@/services/Sales/Receipts/SaleReceiptMailNotificationJob';
import { PaymentReceiveMailNotificationJob } from '@/services/Sales/PaymentReceives/PaymentReceiveMailNotificationJob';
import { PlaidFetchTransactionsJob } from '@/services/Banking/Plaid/PlaidFetchTransactionsJob';
import { ImportDeleteExpiredFilesJobs } from '@/services/Import/jobs/ImportDeleteExpiredFilesJob';

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
  new PaymentReceiveMailNotificationJob(agenda);
  new PlaidFetchTransactionsJob(agenda);
  new ImportDeleteExpiredFilesJobs(agenda);

  agenda.start().then(() => {
    agenda.every('1 hours', 'delete-expired-imported-files', {});
  });
  // agenda.define(
  //   'send-sms-notification-subscribe-end',
  //   { priority: 'nromal', concurrency: 1, },
  //   new SendSMSNotificationSubscribeEnd().handler,
  // );
  // agenda.define(
  //   'send-sms-notification-trial-end',
  //   { priority: 'normal', concurrency: 1, },
  //   new SendSMSNotificationTrialEnd().handler,
  // );
  // agenda.define(
  //   'send-mail-notification-subscribe-end',
  //   { priority: 'high', concurrency: 1, },
  //   new SendMailNotificationSubscribeEnd().handler
  // );
  // agenda.define(
  //   'send-mail-notification-trial-end',
  //   { priority: 'high', concurrency: 1, },
  //   new SendMailNotificationTrialEnd().handler
  // );
  agenda.start();
};
