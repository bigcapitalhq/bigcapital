import { Inject, Injectable } from '@nestjs/common';
import { SettingsStore } from '../SettingsStore';
import { SETTINGS_PROVIDER } from '../Settings.types';

@Injectable()
export class GetSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER) private readonly settingsStore: SettingsStore,
  ) {}

  public async execute() {
    return this.settingsStore.all();
  }
}
