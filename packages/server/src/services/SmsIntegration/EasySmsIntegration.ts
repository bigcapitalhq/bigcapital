import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';

interface IEasysmsIntegrateDTO {
  token: string;
}

const ERRORS = {
  SMS_GATEWAY_NOT_INTEGRATED: 'SMS_GATEWAY_NOT_INTEGRATED',
};

const easysmsSettingsQuery = {
  group: 'sms_integration',
  key: 'easysms_token',
};

@Service()
export default class EasySmsIntegration {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Integrate Easysms SMS gateway with the system.
   * @param {number} tenantId -
   * @param {IEasysmsIntegrateDTO} easysmsIntegrateDTO -
   */
  public integrate = (
    tenantId: number,
    easysmsIntegrateDTO: IEasysmsIntegrateDTO
  ) => {
    const settings = this.tenancy.settings(tenantId);

    settings.set({
      ...easysmsSettingsQuery,
      value: easysmsIntegrateDTO.token,
    });
  };

  /**
   * Disconnects Easysms integration from the system.
   * @param {number} tenantId
   */
  public disconnect = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    settings.remove({ ...easysmsSettingsQuery });
  };

  /**
   * Retrieve the Easysms metadata.
   * @param {number} tenantId
   */
  public getIntegrationMeta = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    const token = settings.get(easysmsSettingsQuery);

    return {
      active: !!token,
    };
  };
}
