import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ServiceError } from '@/modules/Items/ServiceError';
import { SmsIntegrationSettingsService } from './SmsIntegrationSettings.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly smsIntegrationSettings: SmsIntegrationSettingsService,
  ) {}

  /**
   * Sends an SMS message through Twilio.
   * @param {string} to - Destination phone number.
   * @param {string} body - SMS body.
   * @returns {Promise<void>}
   */
  public async send(to: string, body: string): Promise<void> {
    const credentials = await this.smsIntegrationSettings.getCredentials();

    if (!credentials) {
      throw new ServiceError(
        'TWILIO_CREDENTIALS_NOT_CONFIGURED',
        'Twilio credentials are not configured.',
      );
    }

    const phoneNumber = parsePhoneNumberFromString(to);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new ServiceError(
        'CUSTOMER_SMS_NOTIFY_PHONE_INVALID',
        'The personal phone number is invalid.',
      );
    }

    const client = new Twilio(credentials.accountSid, credentials.authToken);

    await client.messages.create({
      from: credentials.fromNumber,
      to: phoneNumber.format('E.164'),
      body,
    });
  }
}
