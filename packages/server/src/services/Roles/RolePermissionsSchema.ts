import * as qim from 'qim';
import { Inject, Service } from 'typedi';

import I18nService from '@/services/I18n/I18nService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { AbilitySchema } from './AbilitySchema';

@Service()
export default class RolePermissionsSchema {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  i18nService: I18nService;

  /**
   * Retrieve the role permissions schema.
   * @param {number} tenantId
   */
  getRolePermissionsSchema(tenantId: number) {
    const $abilities = (f) => (f.abilities ? f : undefined);
    const $extraAbilities = (f) => (f.extraAbilities ? f : undefined);

    const naviagations = [
      [qim.$each, 'subjectLabel'],
      [qim.$each, $abilities, 'abilities', qim.$each, 'label'],
      [qim.$each, $extraAbilities, 'extraAbilities', qim.$each, 'label'],
    ];
    return this.i18nService.i18nApply(naviagations, AbilitySchema, tenantId);
  }
}
