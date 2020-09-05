import Agenda from 'agenda';
import WelcomeEmailJob from '@/jobs/WelcomeEmail';
import WelcomeSMSJob from '@/jobs/WelcomeSMS';
import ResetPasswordMailJob from '@/jobs/ResetPasswordMail';
import ComputeItemCost from '@/jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from '@/jobs/writeInvoicesJEntries';
import SendVoucherViaPhoneJob from '@/jobs/SendVoucherPhone';
import SendVoucherViaEmailJob from '@/jobs/SendVoucherEmail';
import SendSMSNotificationSubscribeEnd from '@/jobs/SMSNotificationSubscribeEnd';
import SendSMSNotificationTrialEnd from '@/jobs/SMSNotificationTrialEnd';
import SendMailNotificationSubscribeEnd from '@/jobs/MailNotificationSubscribeEnd';
import SendMailNotificationTrialEnd from '@/jobs/MailNotificationTrialEnd';
import UserInviteMailJob from '@/jobs/UserInviteMail';

export default ({ agenda }: { agenda: Agenda }) => {
  new WelcomeEmailJob(agenda);
  new ResetPasswordMailJob(agenda);

  agenda.define(
    'welcome-sms',
    { priority: 'high' },
    new WelcomeSMSJob().handler
  );
  
  // User invite mail.
  agenda.define(
    'user-invite-mail',
    { priority: 'high' },
    new UserInviteMailJob().handler,
  )
  agenda.define(
    'compute-item-cost',
    { priority: 'high', concurrency: 20 },
    new ComputeItemCost(agenda).handler,
  );
  agenda.define(
    'rewrite-invoices-journal-entries',
    { priority: 'normal', concurrency: 1, },
    new RewriteInvoicesJournalEntries(agenda).handler,
  );
  agenda.define(
    'send-voucher-via-phone',
    { priority: 'high', concurrency: 1, },
    new SendVoucherViaPhoneJob().handler,
  );
  agenda.define(
    'send-voucher-via-email',
    { priority: 'high', concurrency: 1, },
    new SendVoucherViaEmailJob().handler,
  );
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
