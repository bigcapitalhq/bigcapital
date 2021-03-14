import { Service, Container, Inject } from 'typedi';
import cryptoRandomString from 'crypto-random-string';
import { times } from 'lodash';
import { License, Plan } from 'system/models';
import { ILicense, ISendLicenseDTO } from 'interfaces';
import LicenseMailMessages from 'services/Payment/LicenseMailMessages';
import LicenseSMSMessages from 'services/Payment/LicenseSMSMessages';
import { ServiceError } from 'exceptions';

const ERRORS = {
  PLAN_NOT_FOUND: 'PLAN_NOT_FOUND',
  LICENSE_NOT_FOUND: 'LICENSE_NOT_FOUND',
  LICENSE_ALREADY_DISABLED: 'LICENSE_ALREADY_DISABLED',
  NO_AVALIABLE_LICENSE_CODE: 'NO_AVALIABLE_LICENSE_CODE',
};

@Service()
export default class LicenseService {
  @Inject()
  smsMessages: LicenseSMSMessages;

  @Inject()
  mailMessages: LicenseMailMessages;

  /**
   * Validate the plan existance on the storage.
   * @param {number} tenantId -
   * @param {string} planSlug - Plan slug.
   */
  private async getPlanOrThrowError(planSlug: string) {
    const foundPlan = await Plan.query().where('slug', planSlug).first();

    if (!foundPlan) {
      throw new ServiceError(ERRORS.PLAN_NOT_FOUND);
    }
    return foundPlan;
  }

  /**
   * Valdiate the license existance on the storage.
   * @param {number} licenseId - License id.
   */
  private async getLicenseOrThrowError(licenseId: number) {
    const foundLicense = await License.query().findById(licenseId);

    if (!foundLicense) {
      throw new ServiceError(ERRORS.LICENSE_NOT_FOUND);
    }
    return foundLicense;
  }

  /**
   * Validates whether the license id is disabled.
   * @param {ILicense} license
   */
  private validateNotDisabledLicense(license: ILicense) {
    if (license.disabledAt) {
      throw new ServiceError(ERRORS.LICENSE_ALREADY_DISABLED);
    }
  }

  /**
   * Generates the license code in the given period.
   * @param  {number} licensePeriod
   * @return {Promise<ILicense>}
   */
  public async generateLicense(
    licensePeriod: number,
    periodInterval: string = 'days',
    planSlug: string
  ): ILicense {
    let licenseCode: string;
    let repeat: boolean = true;

    // Retrieve plan or throw not found error.
    const plan = await this.getPlanOrThrowError(planSlug);

    while (repeat) {
      licenseCode = cryptoRandomString({ length: 10, type: 'numeric' });
      const foundLicenses = await License.query().where(
        'license_code',
        licenseCode
      );

      if (foundLicenses.length === 0) {
        repeat = false;
      }
    }
    return License.query().insert({
      licenseCode,
      licensePeriod,
      periodInterval,
      planId: plan.id,
    });
  }

  /**
   * Generates licenses.
   * @param {number} loop
   * @param {number} licensePeriod
   * @param {string} periodInterval
   * @param {number} planId
   */
  public async generateLicenses(
    loop = 1,
    licensePeriod: number,
    periodInterval: string = 'days',
    planSlug: string
  ) {
    const asyncOpers: Promise<any>[] = [];

    times(loop, () => {
      const generateOper = this.generateLicense(
        licensePeriod,
        periodInterval,
        planSlug
      );
      asyncOpers.push(generateOper);
    });
    return Promise.all(asyncOpers);
  }

  /**
   * Disables the given license id on the storage.
   * @param  {string} licenseSlug - License slug.
   * @return {Promise}
   */
  public async disableLicense(licenseId: number) {
    const license = await this.getLicenseOrThrowError(licenseId);

    this.validateNotDisabledLicense(license);

    return License.markLicenseAsDisabled(license.id, 'id');
  }

  /**
   * Deletes the given license id from the storage.
   * @param licenseSlug {string} - License slug.
   */
  public async deleteLicense(licenseSlug: string) {
    const license = await this.getPlanOrThrowError(licenseSlug);

    return License.query().where('id', license.id).delete();
  }

  /**
   * Sends license code to the given customer via SMS or mail message.
   * @param {string} licenseCode - License code.
   * @param {string} phoneNumber - Phone number.
   * @param {string} email - Email address.
   */
  public async sendLicenseToCustomer(sendLicense: ISendLicenseDTO) {
    const agenda = Container.get('agenda');
    const { phoneNumber, email, period, periodInterval } = sendLicense;

    // Retreive plan details byt the given plan slug.
    const plan = await this.getPlanOrThrowError(sendLicense.planSlug);

    const license = await License.query()
      .modify('filterActiveLicense')
      .where('license_period', period)
      .where('period_interval', periodInterval)
      .where('plan_id', plan.id)
      .first();

    if (!license) {
      throw new ServiceError(ERRORS.NO_AVALIABLE_LICENSE_CODE)
    }
    // Mark the license as used.
    await License.markLicenseAsSent(license.licenseCode);

    if (sendLicense.email) {
      await agenda.schedule('1 second', 'send-license-via-email', {
        licenseCode: license.licenseCode,
        email,
      });
    }
    if (phoneNumber) {
      await agenda.schedule('1 second', 'send-license-via-phone', {
        licenseCode: license.licenseCode,
        phoneNumber,
      });
    }
  }
}
