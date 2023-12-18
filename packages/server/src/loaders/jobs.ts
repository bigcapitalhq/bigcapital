import Agenda from 'agenda';
import ResetPasswordMailJob from 'jobs/ResetPasswordMail';
import ComputeItemCost from 'jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from 'jobs/WriteInvoicesJEntries';
import UserInviteMailJob from 'jobs/UserInviteMail';
import OrganizationSetupJob from 'jobs/OrganizationSetup';
import OrganizationUpgrade from 'jobs/OrganizationUpgrade';
import { SendSaleInvoiceMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailJob';
import { SendSaleInvoiceReminderMailJob } from '@/services/Sales/Invoices/SendSaleInvoiceMailReminderJob';

export default ({ agenda }: { agenda: Agenda }) => {
  new ResetPasswordMailJob(agenda);
  new UserInviteMailJob(agenda);
  new ComputeItemCost(agenda);
  new RewriteInvoicesJournalEntries(agenda);
  new OrganizationSetupJob(agenda);
  new OrganizationUpgrade(agenda);
  new SendSaleInvoiceMailJob(agenda);
  new SendSaleInvoiceReminderMailJob(agenda);

  agenda.start();
};
