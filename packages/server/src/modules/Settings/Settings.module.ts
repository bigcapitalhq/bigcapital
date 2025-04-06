import { Global, Module } from '@nestjs/common';
import { SettingRepository } from './repositories/Setting.repository';
import { SettingsStore } from './SettingsStore';
import { SettingsApplicationService } from './SettingsApplication.service';
import { SaveSettingsService } from './commands/SaveSettings.service';
import { SettingsController } from './Settings.controller';
import { SETTINGS_PROVIDER } from './Settings.types';
import { GetSettingsService } from './queries/GetSettings.service';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
  imports: [
    ClsModule.forFeatureAsync({
      provide: SETTINGS_PROVIDER,
      inject: [SettingRepository],
      useFactory: (settingRepository: SettingRepository) => async () => {
        const settings = new SettingsStore(settingRepository);

        // Load settings from database.
        await settings.load();

        return settings;
      },
      global: true,
      strict: true,
      type: 'function',
    }),
  ],
  providers: [
    SettingRepository,
    GetSettingsService,
    SettingsApplicationService,
    SaveSettingsService,
  ],
  exports: [SettingRepository],
  controllers: [SettingsController],
})
export class SettingsModule {}
