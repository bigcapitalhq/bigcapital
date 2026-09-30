import { AccountsTemplate } from '../AccountsTemplates.types';
import { UnitedStatesTemplate } from './united-states';

/**
 * Registered chart of accounts templates. A template for another country is a
 * new file here plus one entry in this list.
 */
export const ACCOUNTS_TEMPLATES: AccountsTemplate[] = [UnitedStatesTemplate];
