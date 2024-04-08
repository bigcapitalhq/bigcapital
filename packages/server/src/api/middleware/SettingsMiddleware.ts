import SettingsStore from '@/services/Settings/SettingsStore';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;

  const Logger = Container.get('logger');
  const tenantContainer = Container.of(`tenant-${tenantId}`);

  if (tenantContainer && !tenantContainer.has('settings')) {
    const { settingRepository } = tenantContainer.get('repositories');

    const settings = new SettingsStore(settingRepository);
    tenantContainer.set('settings', settings);
  }
  const settings = tenantContainer.get('settings');

  await settings.load();

  req.settings = settings;

  res.on('finish', async () => {
    await settings.save();
  });
  next();
};
