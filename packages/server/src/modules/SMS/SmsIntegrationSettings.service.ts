import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { SmsCredentials } from './SMS.types';

@Injectable()
export class SmsIntegrationSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,

    private readonly config: ConfigService,
  ) {}

  /**
   * Resolves the effective Twilio credentials.
   * Organization settings override the global environment variables.
   * @returns {Promise<SmsCredentials | null>}
   */
  public async getCredentials(): Promise<SmsCredentials | null> {
    const store = await this.settingsStore();

    const accountSid =
      this.getSetting(store, 'sms-integration', 'twilio_account_sid') ||
      this.config.get<string>('sms.accountSid');

    const authToken =
      this.getSetting(store, 'sms-integration', 'twilio_auth_token') ||
      this.config.get<string>('sms.authToken');

    const fromNumber =
      this.getSetting(store, 'sms-integration', 'twilio_from_number') ||
      this.config.get<string>('sms.fromNumber');

    if (!accountSid || !authToken || !fromNumber) {
      return null;
    }

    return { accountSid, authToken, fromNumber };
  }

  /**
   * Retrieves a single setting value from the store.
   */
  private getSetting(
    store: SettingsStore,
    group: string,
    key: string,
  ): string | null {
    const value = store.get({ group, key });
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
  }
}
