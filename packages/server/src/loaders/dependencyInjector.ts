import { Container } from 'typedi';
import LoggerInstance from '@/loaders/logger';
import agendaFactory from '@/loaders/agenda';
import SmsClientLoader from '@/loaders/smsClient';
import mailInstance from '@/loaders/mail';
import dbManagerFactory from '@/loaders/dbManager';
import i18n from '@/loaders/i18n';
import repositoriesLoader from '@/loaders/systemRepositories';
import Cache from '@/services/Cache';
import config from '@/config'
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import rateLimiterLoaders from './rateLimiterLoader';
import eventEmitter, { subscribers } from './eventEmitter';

export default ({ mongoConnection, knex }) => {
  try {
    const agendaInstance = agendaFactory({ mongoConnection });
    const smsClientInstance = SmsClientLoader(config.easySMSGateway.api_key);
    const dbManager = dbManagerFactory(knex);
    const cacheInstance = new Cache();

    Container.set('logger', LoggerInstance);
    Container.set('knex', knex);
    Container.set('SMSClient', smsClientInstance);
    Container.set('mail', mailInstance);
  
    Container.set('dbManager', dbManager);
    LoggerInstance.info(
      '[DI] Database manager has been injected into container.'
    );

    Container.set('agenda', agendaInstance);
    LoggerInstance.info('[DI] Agenda has been injected into container');

    Container.set('i18n', i18n());
    LoggerInstance.info('[DI] i18n has been injected into container');

    Container.set('cache', cacheInstance);
    LoggerInstance.info('[DI] cache has been injected into container');

    Container.set('repositories', repositoriesLoader());
    LoggerInstance.info('[DI] repositories has been injected into container');

    rateLimiterLoaders();
    LoggerInstance.info('[DI] rate limiter has been injected into container.');

    Container.set(EventPublisher, eventEmitter());

    const emitter = Container.get(EventPublisher);

    emitter.loadSubscribers(subscribers());


    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
