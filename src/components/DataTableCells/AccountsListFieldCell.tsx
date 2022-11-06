// @ts-nocheck
import React, { useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { CellType } from '@/constants';
import { useCellAutoFocus } from '@/hooks';
import { AccountsSuggestField } from '@/components';

/**
 * Account cell renderer.
 */
export default function AccountCellRenderer({
  column: {
    id,
    accountsDataProp,
    filterAccountsByRootTypes,
    filterAccountsByTypes,
    fieldProps,
    formGroupProps,
  },
  row: { index, original },
  cell: { value: initialValue },
  payload: {
    accounts: defaultAccounts,
    updateData,
    errors,
    autoFocus,
    ...restPayloadProps
  },
}) {
  const accountRef = useRef();

  useCellAutoFocus(accountRef, autoFocus, id, index);

  const handleAccountSelected = useCallback(
    (account) => {
      updateData(index, id, account.id);
    },
    [updateData, index, id],
  );
  const error = errors?.[index]?.[id];

  const accounts = useMemo(
    () => restPayloadProps[accountsDataProp] || defaultAccounts,
    [restPayloadProps, defaultAccounts, accountsDataProp],
  );

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        'form-group--account',
        Classes.FILL,
      )}
      {...formGroupProps}
    >
      <AccountsSuggestField
        accounts={accounts}
        onAccountSelected={handleAccountSelected}
        selectedAccountId={initialValue}
        filterByRootTypes={filterAccountsByRootTypes}
        filterByTypes={filterAccountsByTypes}
        inputProps={{
          inputRef: (ref) => (accountRef.current = ref),
          placeholder: intl.get('search'),
        }}
        openOnKeyDown={true}
        blurOnSelectClose={false}
        {...fieldProps}
      />
    </FormGroup>
  );
}
AccountCellRenderer.cellType = CellType.Field;
