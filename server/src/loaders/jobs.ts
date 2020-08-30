import Agenda from 'agenda';
import WelcomeEmailJob from '@/Jobs/welcomeEmail';
import ComputeItemCost from '@/Jobs/ComputeItemCost';
import RewriteInvoicesJournalEntries from '@/jobs/writeInvoicesJEntries';
import SendVoucherViaPhoneJob from '@/jobs/SendVoucherPhone';
import SendVoucherViaEmailJob from '@/jobs/SendVoucherEmail';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'welcome-email',
    { priority: 'high' },
    new WelcomeEmailJob().handler,
  );
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
  // agenda.define(
  //   'send-sms-notification-subscribe-end',
  //   { priority: 'high', concurrency: 1, },
  // );
  // agenda.define(
  //   'send-mail-notification-subscribe-end',
  //   { priority: 'high', concurrency: 1, },
  // );
  // agenda.define(
  //   'send-sms-notification-trial-end',
  //   { priority: 'high', concurrency: 1, },
  // );
  // agenda.define(
  //   'send-mail-notification-trial-end',
  //   { priority: 'high', concurrency: 1, },
  // );
  agenda.start();
};
