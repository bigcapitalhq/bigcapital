import { Container } from 'typedi';
import LoggerInstance from '@/services/Logger';
import agendaFactory from '@/loaders/agenda';
import SmsClientLoader from '@/loaders/smsClient';

export default ({ mongoConnection, knex }) => {
  try {
    const agendaInstance = agendaFactory({ mongoConnection });
    const smsClientInstance = SmsClientLoader();

    Container.set('agenda', agendaInstance);
    LoggerInstance.info('Agenda has been injected into container');

    Container.set('logger', LoggerInstance)
    LoggerInstance.info('Logger instance has been injected into container');

    Container.set('knex', knex);
    LoggerInstance.info('Knex instance has been injected into container');

    Container.set('SMSClient', smsClientInstance);
    LoggerInstance.info('SMS client has been injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
