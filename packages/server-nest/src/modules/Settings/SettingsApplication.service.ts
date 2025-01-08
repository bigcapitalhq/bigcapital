import { Injectable } from '@nestjs/common';
import { SaveSettingsService } from './commands/SaveSettings.service';
import { ISettingsDTO } from './Settings.types';

@Injectable()
export class SettingsApplicationService {
  constructor(private readonly saveSettingsService: SaveSettingsService) {}

  /**
   * Saves the given settings.
   * @param {ISettingsDTO} settingsDTO
   */
  public async saveSettings(settingsDTO: ISettingsDTO) {
    return this.saveSettingsService.saveSettings(settingsDTO);
  }
}
