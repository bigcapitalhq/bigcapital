import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import {
  ACCOUNT_NUMBER_REGEX,
  AGENCY_NUMBER_REGEX,
  BANK_CODE_REGEX,
  isBankIdentificationAccountType,
  isBankIdentificationCountry,
  isValidCbu,
  normalizeLocation,
} from './bankIdentification';

/**
 * Applies the given schema only when the account being edited is a bank
 * account, leaving the field optional for every other account type.
 *
 * Note the `then`/`otherwise` values are schemas rather than functions: this
 * project is on Yup 0.28, which predates the callback form.
 */
const whenBankAccount = (schema: Yup.StringSchema<any>) =>
  Yup.string().when('accountType', {
    is: (accountType: string) => isBankIdentificationAccountType(accountType),
    then: schema,
    otherwise: Yup.string().nullable(),
  });

/**
 * Builds the account form schema for the given organization location.
 *
 * Organizations in Brazil and Argentina record local banking identifiers on
 * their bank accounts, so the schema depends on where the organization is.
 * Elsewhere the extra fields are neither shown nor validated.
 *
 * Brazil uses a three digit bank code, a branch number of up to five digits and
 * an account number carrying a trailing check digit. That check digit is only
 * validated for shape - Brazilian banks do not share one algorithm for it, so
 * verifying it arithmetically would reject genuinely valid accounts. Argentina
 * uses the CBU, whose two check digits follow a single national standard and
 * are therefore verified in full.
 *
 * @param {string} location - Organization country, ISO 3166-1 alpha-2.
 */
const buildSchema = (location?: string | null) => {
  const country = normalizeLocation(location);
  const isBrazil = isBankIdentificationCountry(country) && country === 'BR';
  const isArgentina = isBankIdentificationCountry(country) && country === 'AR';

  return Yup.object().shape({
    name: Yup.string()
      .required()
      .min(3)
      .max(DATATYPES_LENGTH.STRING)
      .label(intl.get('account_name_')),
    code: Yup.string().nullable().min(3).max(6),
    accountType: Yup.string().required().label(intl.get('account_type')),
    description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
    parentAccountId: Yup.number().nullable(),

    bankCode: isBrazil
      ? whenBankAccount(
          Yup.string()
            .required(intl.get('accounts.bank_code_required'))
            .matches(BANK_CODE_REGEX, intl.get('accounts.bank_code_invalid')),
        )
      : Yup.string().nullable(),

    agencyNumber: isBrazil
      ? whenBankAccount(
          Yup.string()
            .required(intl.get('accounts.agency_number_required'))
            .matches(
              AGENCY_NUMBER_REGEX,
              intl.get('accounts.agency_number_invalid'),
            ),
        )
      : Yup.string().nullable(),

    accountNumber: isBrazil
      ? whenBankAccount(
          Yup.string()
            .required(intl.get('accounts.account_number_required'))
            .matches(
              ACCOUNT_NUMBER_REGEX,
              intl.get('accounts.account_number_invalid'),
            ),
        )
      : Yup.string().nullable(),

    cbu: isArgentina
      ? whenBankAccount(
          Yup.string()
            .required(intl.get('accounts.cbu_required'))
            .test('cbu', intl.get('accounts.cbu_invalid'), (value) =>
              isValidCbu(value),
            ),
        )
      : Yup.string().nullable(),
  });
};

export const getCreateAccountFormSchema = buildSchema;
export const getEditAccountFormSchema = buildSchema;

// Retained for callers that do not need location-aware validation.
export const CreateAccountFormSchema = buildSchema(null);
export const EditAccountFormSchema = buildSchema(null);
