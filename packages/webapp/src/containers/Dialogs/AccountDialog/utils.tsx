import { Account } from '@bigcapital/sdk-ts';
import { isUndefined } from 'lodash';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import type { AccountDialogPayload } from './types';
import { defaultFastFieldShouldUpdate } from '@/utils';

interface ResponseError {
  type: string;
}

export const AccountDialogAction = {
  Edit: 'edit',
  NewChild: 'NewChild',
  NewDefinedType: 'NewDefinedType',
};

/**
 * Transformes the response API errors.
 */
export const transformApiErrors = (errors: ResponseError[]) => {
  const fields: Record<string, string> = {};
  if (errors.find((e) => e.type === 'account_code_required')) {
    fields.code = intl.get('account_code_is_required');
  }
  if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
    fields.code = intl.get('account_code_is_not_unique');
  }
  if (errors.find((e) => e.type === 'account_code_not_unique')) {
    fields.code = intl.get('account_code_is_not_unique');
  }
  if (errors.find((e) => e.type === 'account_name_not_unqiue')) {
    fields.name = intl.get('account_name_is_already_used');
  }
  if (
    errors.find((e) => e.type === 'ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT')
  ) {
    fields.parentAccountId = intl.get(
      'accounts.error.account_currency_not_same_parent_account',
    );
  }
  return fields;
};

/**
 * Payload transformer in account edit mode.
 */
function tranformNewChildAccountPayload(
  _account: Account | undefined,
  payload: AccountDialogPayload,
) {
  return {
    parentAccountId: payload.parentAccountId || '',
    accountType: payload.accountType || '',
    subaccount: true,
  };
}

/**
 * Payload transformer in new account with defined type.
 */
function transformNewDefinedTypePayload(
  _account: Account | undefined,
  payload: AccountDialogPayload,
) {
  return {
    accountType: payload.accountType || '',
  };
}

/**
 * Merged the fetched account with transformed payload.
 */
const mergeWithAccount = R.curry(
  (transformed: Record<string, unknown>, account: Account | undefined) => {
    return {
      ...account,
      ...transformed,
    };
  },
);

/**
 * Default account payload transformer.
 */
const defaultPayloadTransform = (
  account: Account | undefined,
  _payload: AccountDialogPayload,
) => ({
  subaccount: !!account?.parentAccountId,
});

type AccountTransformer = (
  account: Account | undefined,
  payload: AccountDialogPayload,
) => Record<string, unknown>;

/**
 * Defined payload transformers.
 */
function getConditions(): Array<[string, AccountTransformer?]> {
  return [
    [AccountDialogAction.Edit],
    [AccountDialogAction.NewChild, tranformNewChildAccountPayload],
    [AccountDialogAction.NewDefinedType, transformNewDefinedTypePayload],
  ];
}

/**
 * Transformes the given payload to account form initial values.
 */
export const transformAccountToForm = (
  account: Account | undefined,
  payload: AccountDialogPayload,
) => {
  const conditions = getConditions();
  const results = conditions.map((condition) => {
    const transformer: AccountTransformer = !isUndefined(condition[1])
      ? (condition[1] as AccountTransformer)
      : defaultPayloadTransform;

    return [
      condition[0] === payload.action ? R.T : R.F,
      mergeWithAccount(transformer(account, payload)),
    ];
  });
  // ramda's `cond` overload is finicky with our heterogeneous pairs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (R.cond as any)(results)(account);
};

/**
 * Detarmines whether the for fields are disabled.
 */
export const getDisabledFormFields = (
  _account: Account | undefined,
  payload: AccountDialogPayload,
) => {
  return {
    accountType:
      payload.action === AccountDialogAction.Edit ||
      payload.action === AccountDialogAction.NewChild ||
      payload.action === AccountDialogAction.NewDefinedType,
  };
};

/**
 * Detarmines whether should update the parent account field.
 * @param newProps
 * @param oldProps
 * @returns {boolean}
 */
export const parentAccountShouldUpdate = (
  newProps: { formik: { values: { subaccount: boolean } } },
  oldProps: { formik: { values: { subaccount: boolean } } },
) => {
  return (
    newProps.formik.values.subaccount !== oldProps.formik.values.subaccount ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transformes the form values to the request.
 */
export const transformFormToReq = (form: Record<string, unknown>) => {
  return R.compose(
    R.omit(['subaccount']),
    R.when(
      R.propSatisfies(R.equals(R.__, false), 'subaccount'),
      // FIXME: latent bug — `R.assoc` expects a string key, not an array.
      // Preserved from original; runtime coerces array to string.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      R.assoc(['parentAccountId'] as any, '') as any,
    ),
  )(form);
};
