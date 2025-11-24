import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { FMultiSelect } from '../Forms';
import { accountPredicate } from './_components';
import { usePreprocessingAccounts } from './_hooks';
import { DialogsName } from '@/constants/dialogs';
import { useDialogActions } from '@/hooks/state/dashboard';
import { SelectOptionProps } from '@blueprintjs-formik/select';

interface Account {
  id: number;
  name: string;
  code: string;
  account_level: number;
  account_type?: string;
  account_parent_type?: string;
  account_root_type?: string;
  account_normal?: string;
}

interface AccountSelect extends Account, SelectOptionProps { }

type MultiSelectProps = React.ComponentProps<typeof FMultiSelect>;

interface AccountsMultiSelectProps extends Omit<MultiSelectProps, 'items'> {
  items: AccountSelect[];
  allowCreate?: boolean;
  filterByRootTypes?: string[];
  filterByParentTypes?: string[];
  filterByTypes?: string[];
  filterByNormal?: string[];
}

// Create new account renderer.
const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: (event: React.MouseEvent<HTMLElement>) => void,
): React.ReactElement => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (query: string): SelectOptionProps => ({
  label: query,
  value: query,
  id: 0,
});

/**
 * Accounts multi-select field binded with Formik form.
 * @returns {JSX.Element}
 */
export function AccountsMultiSelect({
  items,
  allowCreate,

  filterByRootTypes,
  filterByParentTypes,
  filterByTypes,
  filterByNormal,

  ...rest
}: AccountsMultiSelectProps): React.ReactElement {
  const { openDialog } = useDialogActions();

  // Filters accounts based on filter props.
  const filteredAccounts = usePreprocessingAccounts(items, {
    filterByParentTypes: filterByParentTypes || [],
    filterByTypes: filterByTypes || [],
    filterByNormal: filterByNormal || [],
    filterByRootTypes: filterByRootTypes || [],
  });
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate
    ? createNewItemRenderer
    : undefined;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : undefined;

  // Handles the create item click.
  const handleCreateItemClick = (): void => {
    openDialog(DialogsName.AccountForm);
  };

  return (
    <FMultiSelect<AccountSelect>
      {...rest}
      items={filteredAccounts}
      valueAccessor={'id'}
      textAccessor={'name'}
      labelAccessor={'code'}
      tagAccessor={'name'}
      popoverProps={{ minimal: true }}
      itemPredicate={accountPredicate}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
    />
  );
}
