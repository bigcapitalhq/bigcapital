import Agenda from 'agenda';
import WelcomeEmailJob from 'jobs/welcomeEmail';
import WelcomeSMSJob from 'jobs/WelcomeSMS';
import ResetPasswordMailJob from 'jobs/ResetPasswordMail';
import ComputeItemCost from 'jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from 'jobs/writeInvoicesJEntries';
import UserInviteMailJob from 'jobs/UserInviteMail';
import OrganizationSetupJob from 'jobs/OrganizationSetup';
import OrganizationUpgrade from 'jobs/OrganizationUpgrade';
import SmsNotification from 'jobs/SmsNotification';

export default ({ agenda }: { agenda: Agenda }) => {
  new WelcomeEmailJob(agenda);
  new ResetPasswordMailJob(agenda);
  new WelcomeSMSJob(agenda);
  new UserInviteMailJob(agenda);
  new ComputeItemCost(agenda);
  new RewriteInvoicesJournalEntries(agenda);
  new OrganizationSetupJob(agenda);
  new OrganizationUpgrade(agenda);
  new SmsNotification(agenda);

  agenda.start();
};
