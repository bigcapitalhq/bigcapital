import { ISystemUser } from '@/interfaces';
import { Service } from 'typedi';

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
