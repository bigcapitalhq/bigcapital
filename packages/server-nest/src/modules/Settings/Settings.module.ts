import { Module } from '@nestjs/common';
import { SettingRepository } from './repositories/Setting.repository';
import { SettingsStore } from './SettingsStore';
import { SettingsApplicationService } from './SettingsApplication.service';
import { SaveSettingsService } from './commands/SaveSettings.service';
import { SettingsController } from './Settings.controller';
import { SETTINGS_PROVIDER } from './Settings.types';

@Module({
  providers: [
    SettingRepository,
    {
      provide: SETTINGS_PROVIDER,
      useFactory: (settingRepository: SettingRepository) => {
        return new SettingsStore(settingRepository);
      },
      inject: [SettingRepository],
    },
    SettingsApplicationService,
    SaveSettingsService,
  ],
  controllers: [SettingsController],
  exports: [SETTINGS_PROVIDER],
})
export class SettingsModule {}
