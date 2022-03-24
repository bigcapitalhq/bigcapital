import intl from 'react-intl-universal';
import * as R from 'ramda';
import { isEmpty } from 'lodash';

export const transformApiErrors = (errors) => {
  const fields = {};
  if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
    fields.code = intl.get('account_code_is_not_unique');
  }
  if (errors.find((e) => e.type === 'ACCOUNT.NAME.NOT.UNIQUE')) {
    fields.name = intl.get('account_name_is_already_used');
  }
  if (
    errors.find((e) => e.type === 'ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT')
  ) {
    fields.parent_account_id = intl.get(
      'accounts.error.account_currency_not_same_parent_account',
    );
  }
  return fields;
};

/**
 * Payload transformer in account edit mode.
 */
function transformEditMode(payload) {
  return {
    parent_account_id: payload.parentAccountId || '',
    account_type: payload.accountType || '',
    subaccount: true,
  };
}

/**
 * Payload transformer in new account with defined type.
 */
function transformNewAccountDefinedType(payload) {
  return {
    account_type: payload.accountType || '',
  };
}

/**
 * Merged the fetched account with transformed payload.
 */
const mergeWithAccount = R.curry((transformed, account) => {
  return {
    ...account,
    ...transformed,
  };
});

/**
 * Default account payload transformer.
 */
const defaultPayloadTransform = () => ({});

/**
 * Defined payload transformers.
 */
function getConditions() {
  return [
    ['edit'],
    ['new_child', transformEditMode],
    ['NEW_ACCOUNT_DEFINED_TYPE', transformNewAccountDefinedType],
  ];
}

/**
 * Transformes the given payload to account form initial values.
 */
export const transformAccountToForm = (account, payload) => {
  const conditions = getConditions();

  const results = conditions.map((condition) => {
    const transformer = !isEmpty(condition[1])
      ? condition[1]
      : defaultPayloadTransform;

    return [
      condition[0] === payload.action ? R.T : R.F,
      mergeWithAccount(transformer(payload)),
    ];
  });
  return R.cond(results)(account);
};
