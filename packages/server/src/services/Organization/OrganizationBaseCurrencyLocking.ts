import { isEmpty } from 'lodash';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TimeoutSettings } from 'puppeteer';

interface MutateBaseCurrencyLockMeta {
  modelName: string;
  pluralName?: string;
}

@Service()
export default class OrganizationBaseCurrencyLocking {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves the tenant models that have prevented mutation base currency.
   */
  private getModelsPreventsMutate = (tenantId: number) => {
    const Models = this.tenancy.models(tenantId);

    const filteredEntries = Object.entries(Models).filter(
      ([key, Model]) => !!Model.preventMutateBaseCurrency
    );
    return Object.fromEntries(filteredEntries);
  };

  /**
   * Determines the mutation base currency model is locked.
   * @param   {Model} Model
   * @returns {Promise<MutateBaseCurrencyLockMeta | false>}
   */
  private isModelMutateLocked = async (
    Model
  ): Promise<MutateBaseCurrencyLockMeta | false> => {
    const validateQuery = Model.query();

    if (typeof Model?.modifiers?.preventMutateBaseCurrency !== 'undefined') {
      validateQuery.modify('preventMutateBaseCurrency');
    } else {
      validateQuery.select(['id']).first();
    }
    const validateResult = await validateQuery;
    const isValid = !isEmpty(validateResult);

    return isValid
      ? {
          modelName: Model.name,
          pluralName: Model.pluralName,
        }
      : false;
  };

  /**
   * Retrieves the base currency mutation locks of the tenant models.
   * @param   {number} tenantId
   * @returns {Promise<MutateBaseCurrencyLockMeta[]>}
   */
  public async baseCurrencyMutateLocks(
    tenantId: number
  ): Promise<MutateBaseCurrencyLockMeta[]> {
    const PreventedModels = this.getModelsPreventsMutate(tenantId);

    const opers = Object.entries(PreventedModels).map(([ModelName, Model]) =>
      this.isModelMutateLocked(Model)
    );
    const results = await Promise.all(opers);

    return results.filter(
      (result) => result !== false
    ) as MutateBaseCurrencyLockMeta[];
  }

  /**
   * Determines the base currency mutation locked.
   * @param   {number} tenantId
   * @returns {Promise<boolean>}
   */
  public isBaseCurrencyMutateLocked = async (tenantId: number) => {
    const locks = await this.baseCurrencyMutateLocks(tenantId);

    return !isEmpty(locks);
  };
}
