import { formatMessage } from 'services/intl';

export const transformApiErrors = (errors) => {
  const fields = {};
  if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
    fields.code = formatMessage({ id: 'account_code_is_not_unique' });
  }
  if (errors.find((e) => e.type === 'ACCOUNT.NAME.NOT.UNIQUE')) {
    fields.name = formatMessage({ id: 'account_name_is_already_used' });
  }
  return fields;
};

export const transformAccountToForm = (account, {
  action,
  parentAccountId,
  accountTypeId
}) => {
  return {
    parent_account_id: action === 'new_child' ? parentAccountId : '',
    account_type_id: action === 'new_child'? accountTypeId : '',
    subaccount: action === 'new_child' ? true : false,
    ...account,
  }
}