import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { AccountingBasis } from '@/common/types/AccountingBasis';

export type WithAccountingBasis<T> = Omit<T, 'basis'> & {
  readonly basis: AccountingBasis;
};

/**
 * Resolves the accounting basis used by the financial statements.
 * The explicit basis of the report query takes precedence, otherwise
 * the organization accounting basis setting is used.
 */
@Injectable()
export class AccountingBasisService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Retrieves the organization accounting basis setting.
   * @returns {Promise<AccountingBasis>}
   */
  public async getOrganizationBasis(): Promise<AccountingBasis> {
    const store = await this.settingsStore();
    const basis = store.get(
      { group: 'organization', key: 'accounting_basis' },
      AccountingBasis.Accrual,
    );
    return basis === AccountingBasis.Cash
      ? AccountingBasis.Cash
      : AccountingBasis.Accrual;
  }

  public async resolveQuery<T extends object>(
    query: T & { basis?: AccountingBasis | null },
  ): Promise<WithAccountingBasis<T>> {
    return { ...query, basis: await this.resolve(query.basis) };
  }

  /**
   * Resolves the accounting basis of the given report query.
   * Falls back to the organization accounting basis setting when
   * the query has no explicit basis.
   * @param {AccountingBasis} basis - The query accounting basis.
   * @returns {Promise<AccountingBasis>}
   */
  public async resolve(
    basis?: AccountingBasis | null,
  ): Promise<AccountingBasis> {
    if (basis === AccountingBasis.Cash || basis === AccountingBasis.Accrual) {
      return basis;
    }
    return this.getOrganizationBasis();
  }
}
