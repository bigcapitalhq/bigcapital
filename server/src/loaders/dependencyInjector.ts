import { Container } from 'typedi';
import LoggerInstance from '@/loaders/Logger';
import agendaFactory from '@/loaders/agenda';
import SmsClientLoader from '@/loaders/smsClient';
import mailInstance from '@/loaders/mail';
import dbManagerFactory from '@/loaders/dbManager';

export default ({ mongoConnection, knex }) => {
  try {
    const agendaInstance = agendaFactory({ mongoConnection });
    const smsClientInstance = SmsClientLoader();
    const dbManager = dbManagerFactory();

    Container.set('agenda', agendaInstance);
    LoggerInstance.info('Agenda has been injected into container');

    Container.set('logger', LoggerInstance)
    LoggerInstance.info('Logger instance has been injected into container');

    Container.set('knex', knex);
    LoggerInstance.info('Knex instance has been injected into container');

    Container.set('SMSClient', smsClientInstance);
    LoggerInstance.info('SMS client has been injected into container');

    Container.set('mail', mailInstance);
    LoggerInstance.info('Mail instance has been injected into container');

    Container.set('dbManager', dbManager);
    LoggerInstance.info('Database manager has been injected into container.');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
