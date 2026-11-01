import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsStore } from '../SettingsStore';
import { SETTINGS_PROVIDER } from '../Settings.types';

@Injectable()
export class GetSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,

    private readonly configService: ConfigService,
  ) {}

  public async execute() {
    const settings = await (await this.settingsStore()).all();
    const smsConfig = this.configService.get('sms', {
      accountSid: '',
      authToken: '',
      fromNumber: '',
    });
    const isEnvCredentialsActive = Boolean(
      smsConfig.accountSid && smsConfig.authToken && smsConfig.fromNumber,
    );

    return [
      ...settings,
      {
        key: 'is_env_credentials_active',
        value: isEnvCredentialsActive,
        group: 'sms-integration',
      },
    ];
  }
}
