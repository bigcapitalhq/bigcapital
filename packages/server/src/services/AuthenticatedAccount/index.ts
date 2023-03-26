import { Service, Inject } from 'typedi';
import { ISystemUser } from '@/interfaces';

@Service()
export default class AuthenticatedAccount {
  /**
   *
   * @param {number} tenantId
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  getAccount = async (tenantId: number, authorizedUser: ISystemUser) => {
    return authorizedUser;
  };
}
