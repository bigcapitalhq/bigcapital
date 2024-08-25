import { Service } from 'typedi';
import { IAuthGetMetaPOJO } from '@/interfaces';
import config from '@/config';

@Service()
export class GetAuthMeta {
  /**
   * Retrieves the authentication meta for SPA.
   * @returns {Promise<IAuthGetMetaPOJO>}
   */
  public async getAuthMeta(): Promise<IAuthGetMetaPOJO> {
    return {
      signupDisabled: config.signupRestrictions.disabled,
      oneClickDemo: {
        enable: config.oneClickDemoAccounts.enable,
        demoUrl: config.oneClickDemoAccounts.demoUrl,
      },
    };
  }
}
