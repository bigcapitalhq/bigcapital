import React, { useMemo, useCallback } from 'react';

import {
  PopoverInteractionKind,
  Tooltip,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { ListSelect, MODIFIER } from 'components';

export default function FinancialAccountsFilter({
  ...restProps
}) {
  const { formatMessage } = useIntl();
  const filterAccountsOptions = useMemo(
    () => [
      {
        key: 'all-accounts',
        name: formatMessage({ id: 'all_accounts' }),
        hint: formatMessage({ id: 'all_accounts_including_with_zero_balance' }),
      },
      {
        key: 'without-zero-balance',
        name: formatMessage({ id: 'accounts_without_zero_balance' }),
        hint: formatMessage({ id: 'include_accounts_and_exclude_zero_balance' }),
      },
      {
        key: 'with-transactions',
        name: formatMessage({ id: 'accounts_with_transactions' }),
        hint: formatMessage({ id: 'include_accounts_once_has_transactions_on_given_date_period' }),
      },
    ],
    [formatMessage],
  );
  const SUBMENU_POPOVER_MODIFIERS = {
    flip: { boundariesElement: 'viewport', padding: 20 },
    offset: { offset: '0, 10' },
    preventOverflow: { boundariesElement: 'viewport', padding: 40 },
  };

  const filterAccountRenderer = useCallback(
    (item, { handleClick, modifiers, query }) => {
      return (
        <Tooltip
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.RIGHT_TOP}
          content={item.hint}
          modifiers={SUBMENU_POPOVER_MODIFIERS}
          inline={true}
          minimal={true}
          className={MODIFIER.SELECT_LIST_TOOLTIP_ITEMS}
        >
          <MenuItem text={item.name} key={item.key} onClick={handleClick} />
        </Tooltip>
      );
    },
    [],
  );

  return (
    <ListSelect
      items={filterAccountsOptions}
      itemRenderer={filterAccountRenderer}
      popoverProps={{ minimal: true, }}
      filterable={false}
      selectedItemProp={'key'}
      labelProp={'name'}
      // className={}
      {...restProps}
    />
  );
}