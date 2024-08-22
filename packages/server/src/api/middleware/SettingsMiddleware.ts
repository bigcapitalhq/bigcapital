import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import SettingsStore from '@/services/Settings/SettingsStore';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;

  const settings = await initializeTenantSettings(tenantId);
  req.settings = settings;

  res.on('finish', async () => {
    await settings.save();
  });
  next();
}


export const initializeTenantSettings = async (tenantId: number) => {
  const tenantContainer = Container.of(`tenant-${tenantId}`);

  if (tenantContainer && !tenantContainer.has('settings')) {
    const { settingRepository } = tenantContainer.get('repositories');

    const settings = new SettingsStore(settingRepository);
    tenantContainer.set('settings', settings);
  }
  const settings = tenantContainer.get('settings');

  await settings.load();

  return settings;
}