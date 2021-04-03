import Agenda from 'agenda';
import WelcomeEmailJob from 'jobs/welcomeEmail';
import WelcomeSMSJob from 'jobs/WelcomeSMS';
import ResetPasswordMailJob from 'jobs/ResetPasswordMail';
import ComputeItemCost from 'jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from 'jobs/writeInvoicesJEntries';
import SendLicenseViaPhoneJob from 'jobs/SendLicensePhone';
import SendLicenseViaEmailJob from 'jobs/SendLicenseEmail';
import SendSMSNotificationSubscribeEnd from 'jobs/SMSNotificationSubscribeEnd';
import SendSMSNotificationTrialEnd from 'jobs/SMSNotificationTrialEnd';
import SendMailNotificationSubscribeEnd from 'jobs/MailNotificationSubscribeEnd';
import SendMailNotificationTrialEnd from 'jobs/MailNotificationTrialEnd';
import UserInviteMailJob from 'jobs/UserInviteMail';

export default ({ agenda }: { agenda: Agenda }) => {
  new WelcomeEmailJob(agenda);
  new ResetPasswordMailJob(agenda);
  new WelcomeSMSJob(agenda);
  new UserInviteMailJob(agenda);
  new SendLicenseViaEmailJob(agenda);
  new SendLicenseViaPhoneJob(agenda);
  new ComputeItemCost(agenda);
  new RewriteInvoicesJournalEntries(agenda);

  agenda.define(
    'send-sms-notification-subscribe-end',
    { priority: 'nromal', concurrency: 1, },
    new SendSMSNotificationSubscribeEnd().handler,
  );
  agenda.define(
    'send-sms-notification-trial-end',
    { priority: 'normal', concurrency: 1, },
    new SendSMSNotificationTrialEnd().handler,
  );
  agenda.define(
    'send-mail-notification-subscribe-end',
    { priority: 'high', concurrency: 1, },
    new SendMailNotificationSubscribeEnd().handler
  );
  agenda.define(
    'send-mail-notification-trial-end',
    { priority: 'high', concurrency: 1, },
    new SendMailNotificationTrialEnd().handler
  );
  agenda.start();
};
