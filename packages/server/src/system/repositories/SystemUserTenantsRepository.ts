import moment from 'moment';
import SystemRepository from '@/system/repositories/SystemRepository';
import { UserTenants } from '@/system/models';
import { IUserTenants } from '@/interfaces';

export default class SystemUserTenantsRepository extends SystemRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    console.log(UserTenants);
    return UserTenants.bindKnex(this.knex);
  }
}
