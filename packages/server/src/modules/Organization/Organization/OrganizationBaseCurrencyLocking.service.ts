import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { getPreventMutateBaseCurrencyModels } from '@/common/decorators/LockMutateBaseCurrency.decorator';
import { ModuleRef } from '@nestjs/core';

interface MutateBaseCurrencyLockMeta {
  modelName: string;
  pluralName?: string;
}

@Injectable()
export class OrganizationBaseCurrencyLocking {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Retrieves the tenant models that have prevented mutation base currency.
   */
  private getModelsPreventsMutate() {
    const lockedModels = getPreventMutateBaseCurrencyModels();

    const filteredEntries = Array.from(lockedModels).filter(
      ([key, Model]) => !!Model.preventMutateBaseCurrency,
    );
    return Object.fromEntries(filteredEntries);
  }

  /**
   * Detarmines the mutation base currency model is locked.
   * @returns {Promise<MutateBaseCurrencyLockMeta | false>}
   */
  private async isModelMutateLocked(
    Model,
  ): Promise<MutateBaseCurrencyLockMeta | false> {
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
  }

  /**
   * Retrieves the base currency mutation locks of the tenant models.
   * @returns {Promise<MutateBaseCurrencyLockMeta[]>}
   */
  public async baseCurrencyMutateLocks(): Promise<
    MutateBaseCurrencyLockMeta[]
  > {
    const PreventedModels = this.getModelsPreventsMutate();
    const opers = Object.entries(PreventedModels).map(([ModelName, Model]) => {
      const InjectedModelProxy = this.moduleRef.get(ModelName, {
        strict: false,
      });
      const InjectedModel = InjectedModelProxy();

      return this.isModelMutateLocked(InjectedModel);
    });
    const results = await Promise.all(opers);

    return results.filter(
      (result) => result !== false,
    ) as MutateBaseCurrencyLockMeta[];
  }

  /**
   * Detarmines the base currency mutation locked.
   * @returns {Promise<boolean>}
   */
  public async isBaseCurrencyMutateLocked() {
    const locks = await this.baseCurrencyMutateLocks();

    return !isEmpty(locks);
  }
}
