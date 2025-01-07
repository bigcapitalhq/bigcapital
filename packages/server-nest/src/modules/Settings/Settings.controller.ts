import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SETTINGS } from './Settings.module';
import { SettingsStore } from './SettingsStore';

@Controller('settings')
export class SettingsController {
  constructor(
    @Inject(SETTINGS) private readonly settingsStore: SettingsStore,
  ) {}

  @Get('')
  async getSettings() {
    return this.settingsStore.all();
  }
}
