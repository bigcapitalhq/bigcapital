import { Service, Container, Inject } from 'typedi';
import cryptoRandomString from 'crypto-random-string';
import { times } from 'lodash';
import { License } from "@/system/models";
import { ILicense } from '@/interfaces';
import LicenseMailMessages from '@/services/Payment/LicenseMailMessages';
import LicenseSMSMessages from '@/services/Payment/LicenseSMSMessages';

@Service()
export default class LicenseService {
  @Inject()
  smsMessages: LicenseSMSMessages;

  @Inject()
  mailMessages: LicenseMailMessages;

  /**
   * Generates the license code in the given period.
   * @param {number} licensePeriod 
   * @return {Promise<ILicense>}
   */
  async generateLicense(
    licensePeriod: number,
    periodInterval: string = 'days',
    planId: number,
  ): ILicense {
    let licenseCode: string;
    let repeat: boolean = true;

    console.log(License);

    while(repeat) {
      licenseCode = cryptoRandomString({ length: 10, type: 'numeric' });
      const foundLicenses = await License.query().where('license_code', licenseCode);

  		if (foundLicenses.length === 0) {
			  repeat = false;
      }
    }
    return License.query().insert({
      licenseCode, licensePeriod, periodInterval, planId,
    });
  }

  /**
   * 
   * @param {number} loop 
   * @param {number} licensePeriod 
   * @param {string} periodInterval 
   * @param {number} planId 
   */
  async generateLicenses(
    loop = 1,
    licensePeriod: number,
    periodInterval: string = 'days',
    planId: number,
  ) {
    const asyncOpers: Promise<any>[] = [];

    times(loop, () => {
      const generateOper = this.generateLicense(licensePeriod, periodInterval, planId);
      asyncOpers.push(generateOper);
    });
    return Promise.all(asyncOpers);
  }

  /**
   * Disables the given license id on the storage.
   * @param  {number} licenseId 
   * @return {Promise}
   */
  async disableLicense(licenseId: number) {
    return License.markLicenseAsDisabled(licenseId, 'id');
  }

  /**
   * Deletes the given license id from the storage.
   * @param licenseId 
   */
  async deleteLicense(licenseId: number) {
    return License.query().where('id', licenseId).delete();
  }

  /**
   * Sends license code to the given customer via SMS or mail message.
   * @param {string} licenseCode - License code
   * @param {string} phoneNumber - Phone number
   * @param {string} email - Email address.
   */
  async sendLicenseToCustomer(licenseCode: string, phoneNumber: string, email: string) {
    const agenda = Container.get('agenda');

    // Mark the license as used.
    await License.markLicenseAsSent(licenseCode);

    if (email) {
      await agenda.schedule('1 second', 'send-license-via-email', { licenseCode, email });
    }
    if (phoneNumber) {
      await agenda.schedule('1 second', 'send-license-via-phone', { licenseCode, phoneNumber });
    }
  }
}