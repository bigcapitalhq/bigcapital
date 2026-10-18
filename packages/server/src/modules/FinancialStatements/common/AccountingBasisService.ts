import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { LedgerBasis } from '@/modules/Ledger/types/Ledger.types';

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
   * @returns {Promise<LedgerBasis>}
   */
  public async getOrganizationBasis(): Promise<LedgerBasis> {
    const store = await this.settingsStore();
    const basis = store.get(
      { group: 'organization', key: 'accounting_basis' },
      'accrual',
    );
    return basis === 'cash' ? 'cash' : 'accrual';
  }

  /**
   * Resolves the accounting basis of the given report query.
   * Falls back to the organization accounting basis setting when
   * the query has no explicit basis.
   * @param {string} basis - The query accounting basis.
   * @returns {Promise<LedgerBasis>}
   */
  public async resolve(basis?: string | null): Promise<LedgerBasis> {
    if (basis === 'cash' || basis === 'accrual') {
      return basis;
    }
    return this.getOrganizationBasis();
  }
}
