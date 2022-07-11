import intl from 'react-intl-universal';
import * as R from 'ramda';
import { isUndefined } from 'lodash';

export const AccountDialogAction = {
  Edit: 'edit',
  NewChild: 'NewChild',
  NewDefinedType: 'NewDefinedType',
};

/**
 * Transformes the response API errors.
 */
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
function tranformNewChildAccountPayload(payload) {
  return {
    parent_account_id: payload.parentAccountId || '',
    account_type: payload.accountType || '',
    subaccount: true,
  };
}

/**
 * Payload transformer in new account with defined type.
 */
function transformNewDefinedTypePayload(payload) {
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
    [AccountDialogAction.Edit],
    [AccountDialogAction.NewChild, tranformNewChildAccountPayload],
    [AccountDialogAction.NewDefinedType, transformNewDefinedTypePayload],
  ];
}

/**
 * Transformes the given payload to account form initial values.
 */
export const transformAccountToForm = (account, payload) => {
  const conditions = getConditions();

  const results = conditions.map((condition) => {
    const transformer = !isUndefined(condition[1])
      ? condition[1]
      : defaultPayloadTransform;

    return [
      condition[0] === payload.action ? R.T : R.F,
      mergeWithAccount(transformer(payload)),
    ];
  });
  return R.cond(results)(account);
};

/**
 * Detarmines whether the for fields are disabled.
 */
export const getDisabledFormFields = (account, payload) => {
  return {
    accountType:
      payload.action === AccountDialogAction.Edit ||
      payload.action === AccountDialogAction.NewChild ||
      payload.action === AccountDialogAction.NewDefinedType,
  };
};
