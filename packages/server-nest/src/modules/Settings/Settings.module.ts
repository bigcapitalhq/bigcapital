import { Module } from '@nestjs/common';
import { SettingRepository } from './repositories/Setting.repository';
import { SettingsStore } from './SettingsStore';

export const SETTINGS = 'SETTINGS';

@Module({
  providers: [
    SettingRepository,
    {
      provide: SETTINGS,
      useFactory: (settingRepository: SettingRepository) => {
        return new SettingsStore(settingRepository);
      },
      inject: [SettingRepository],
    },
  ],
  exports: [SETTINGS]
})
export class SettingsModule {}
