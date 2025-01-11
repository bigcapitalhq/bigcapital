import { Injectable } from '@nestjs/common';
import { SaveSettingsService } from './commands/SaveSettings.service';
import { ISettingsDTO } from './Settings.types';
import { GetSettingsService } from './queries/GetSettings.service';

@Injectable()
export class SettingsApplicationService {
  constructor(
    private readonly saveSettingsService: SaveSettingsService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  /**
   * Saves the given settings.
   * @param {ISettingsDTO} settingsDTO
   */
  public async saveSettings(settingsDTO: ISettingsDTO) {
    return this.saveSettingsService.saveSettings(settingsDTO);
  }

  public async getSettings() {
    return this.getSettingsService.execute();
  }
}
