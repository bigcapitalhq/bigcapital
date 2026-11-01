import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import type { AccountTypesList } from '@bigcapital/sdk-ts';
import type { ItemRendererProps } from '@blueprintjs/select';
import { FSelect } from '@/components/Forms';

type FSelectProps = React.ComponentProps<typeof FSelect>;
type AccountType = AccountTypesList[number];

interface AccountsTypesSelectProps extends Omit<FSelectProps, 'items'> {
  items: AccountTypesList;
}

/**
 * Renders an account type option in the select popover.
 */
function AccountTypeItemRenderer(
  item: AccountType,
  { handleClick, modifiers }: ItemRendererProps,
) {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.label}
      key={item.key}
      text={item.label}
      onClick={handleClick}
      data-testId={'account-type-option'}
    />
  );
}

export function AccountsTypesSelect({
  ...props
}: AccountsTypesSelectProps): React.ReactElement {
  return (
    <FSelect<AccountType>
      valueAccessor={'key'}
      labelAccessor={'label'}
      textAccessor={'label'}
      placeholder={'Select an account...'}
      buttonProps={{ 'data-testId': 'account-type-select' }}
      itemRenderer={AccountTypeItemRenderer}
      {...props}
    />
  );
}
