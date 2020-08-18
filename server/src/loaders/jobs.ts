import Agenda from 'agenda';
import WelcomeEmailJob from '@/Jobs/welcomeEmail';
import ComputeItemCost from '@/Jobs/ComputeItemCost';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'welcome-email',
    { priority: 'high' },
    new WelcomeEmailJob().handler,
  );
  agenda.define(
    'compute-item-cost',
    { priority: 'high' },
    new ComputeItemCost().handler,
  );
  agenda.start();
};
