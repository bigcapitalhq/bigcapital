import { Container } from 'typedi';
import LoggerInstance from '@/services/Logger';
import agendaFactory from '@/loaders/agenda';

export default ({ mongoConnection, knex }) => {
  try {;
    const agendaInstance = agendaFactory({ mongoConnection });

    Container.set('agenda', agendaInstance);
    Container.set('logger', LoggerInstance)
    Container.set('knex', knex);

    LoggerInstance.info('Agenda has been injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
