import intl from 'react-intl-universal';

export const transformApiErrors = (errors) => {
  const fields = {};
  if (errors.find((e) => e.type === 'NOT_UNIQUE_CODE')) {
    fields.code = intl.get('account_code_is_not_unique');
  }
  if (errors.find((e) => e.type === 'ACCOUNT.NAME.NOT.UNIQUE')) {
    fields.name = intl.get('account_name_is_already_used');
  }
  return fields;
};

export const transformAccountToForm = (account, {
  action,
  parentAccountId,
  accountType
}) => {
  return {
    parent_account_id: action === 'new_child' ? parentAccountId : '',
    account_type: action === 'new_child'? accountType : '',
    subaccount: action === 'new_child' ? true : false,
    ...account,
  }
}