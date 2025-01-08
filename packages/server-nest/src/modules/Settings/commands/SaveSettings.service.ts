import { Inject, Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { SettingsStore } from '../SettingsStore';
import { IOptionDTO, ISettingsDTO, SETTINGS_PROVIDER } from '../Settings.types';

@Injectable()
export class SaveSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: SettingsStore,
  ) {}

  /**
   * Saves the given settings.
   * @param {ISettingsDTO} settingsDTO
   */
  public async saveSettings(settingsDTO: ISettingsDTO) {
    const notDefinedOptions = this.validateNotDefinedSettings(
      settingsDTO.options,
    );
    const errorReasons: { type: string; code: number; keys: any[] }[] = [];
    if (notDefinedOptions.length) {
      errorReasons.push({
        type: 'OPTIONS.KEY.NOT.DEFINED',
        code: 200,
        keys: notDefinedOptions.map((o) => ({ ...pick(o, ['key', 'group']) })),
      });
    }
    if (errorReasons.length) {
      throw new Error(JSON.stringify(errorReasons));
    }
    settingsDTO.options.forEach((option: IOptionDTO) => {
      this.settingsStore.set({ ...option });
    });
    await this.settingsStore.save();
  }

  /**
   * Validates the given options is defined or either not.
   * @param {Array} options
   * @return {Boolean}
   */
  private validateNotDefinedSettings(options) {
    const notDefined = [];

    options.forEach((option) => {
      const setting = this.settingsStore.config.getMetaConfig(
        option.key,
        option.group,
      );

      if (!setting) {
        notDefined.push(option);
      }
    });
    return notDefined;
  }
}
