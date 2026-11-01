import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { accountPredicate } from './_components';
import { usePreprocessingAccounts } from './_hooks';
import { AccountSelectModel } from './AccountsMultiSelect';
import type { ItemRenderer } from '@blueprintjs/select';
import { MenuItemNestedText, FSelect } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { useDialogActions } from '@/hooks/state/dashboard';

type FSelectProps = React.ComponentProps<typeof FSelect>;

interface AccountsSelectProps extends Omit<FSelectProps, 'items'> {
  items: AccountSelectModel[];
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
const createNewItemFromQuery = (query: string): AccountSelectModel => ({
  label: query,
  value: query,
  text: query,
  id: 0,
  name: query,
  code: query,
});

// Default account item renderer.
const accountRenderer: ItemRenderer<AccountSelectModel> = (
  item,
  { handleClick, modifiers },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.code}
      key={item.id}
      text={<MenuItemNestedText level={item.accountLevel} text={item.name} />}
      onClick={handleClick}
    />
  );
};

/**
 * Accounts select field binded with Formik form.
 * @returns {JSX.Element}
 */
export function AccountsSelect({
  items,
  allowCreate,

  filterByRootTypes,
  filterByParentTypes,
  filterByTypes,
  filterByNormal,

  ...rest
}: AccountsSelectProps): React.ReactElement {
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
    <FSelect<AccountSelectModel>
      {...rest}
      items={filteredAccounts}
      textAccessor={'name'}
      labelAccessor={'code'}
      valueAccessor={'id'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      itemPredicate={accountPredicate}
      itemRenderer={accountRenderer}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
    />
  );
}
