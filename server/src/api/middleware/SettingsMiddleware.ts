import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import SettingsStore from 'services/Settings/SettingsStore';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;
  const { knex } = req;

  const Logger = Container.get('logger');
  const tenantContainer = Container.of(`tenant-${tenantId}`);

  if (tenantContainer && !tenantContainer.has('settings')) {
    Logger.info('[settings_middleware] initialize settings store.');
    const settings = new SettingsStore(knex);

    Logger.info('[settings_middleware] load settings from storage or cache.');
    await settings.load();

    tenantContainer.set('settings', settings);
  }
  Logger.info('[settings_middleware] get settings instance from container.');
  const settings = tenantContainer.get('settings');
  req.settings = settings;

  res.on('finish', async () => {
    await settings.save();
  });
  next();
}