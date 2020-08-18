import Logger from '@/services/Logger';
import mongooseLoader from '@/loaders/mongoose';
import jobsLoader from '@/loaders/jobs';
import expressLoader from '@/loaders/express';
import databaseLoader from '@/database/knex';
import dependencyInjectorLoader from '@/loaders/dependencyInjector';
import objectionLoader from '@/database/objection';

// We have to import at least all the events once so they can be triggered
import '@/loaders/events';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('MongoDB loaded and connected!');

  // Initialize the system database once app started.
  const knex = databaseLoader();

  // Initialize the objection.js from knex instance.
  objectionLoader({ knex });

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    knex,
  });
  await jobsLoader({ agenda });
  Logger.info('Jobs loaded');

  expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
