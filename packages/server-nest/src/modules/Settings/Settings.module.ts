import { Module } from '@nestjs/common';
import { SettingRepository } from './repositories/Setting.repository';
import { SettingsStore } from './SettingsStore';
import { SettingsApplicationService } from './SettingsApplication.service';
import { SaveSettingsService } from './commands/SaveSettings.service';
import { SettingsController } from './Settings.controller';
import { SETTINGS_PROVIDER } from './Settings.types';
import { GetSettingsService } from './queries/GetSettings.service';

@Module({
  providers: [
    SettingRepository,
    {
      provide: SETTINGS_PROVIDER,
      useFactory: async (settingRepository: SettingRepository) => {
        const settings = new SettingsStore(settingRepository);

        // Load settings from database.
        await settings.load();

        return settings;
      },
      inject: [SettingRepository],
    },
    GetSettingsService,
    SettingsApplicationService,
    SaveSettingsService,
  ],
  controllers: [SettingsController],
  exports: [SETTINGS_PROVIDER],
})
export class SettingsModule {}
