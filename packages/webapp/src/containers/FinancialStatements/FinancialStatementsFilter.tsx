// @ts-nocheck
import React from 'react';
import {
  PopoverInteractionKind,
  Tooltip,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FFormGroup,
  FSelect,
  MODIFIER,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { filterAccountsOptions } from './constants';

const SUBMENU_POPOVER_MODIFIERS = {
  flip: { boundariesElement: 'viewport', padding: 20 },
  offset: { offset: '0, 10' },
  preventOverflow: { boundariesElement: 'viewport', padding: 40 },
};

export default function FinancialStatementsFilter({
  items = filterAccountsOptions,
  label = <T id={'filter_accounts'} />,
  ...restProps
}) {
  const filterRenderer = (item, { handleClick, modifiers, query }) => {
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
  };

  return (
    <FFormGroup name={'filterByOption'} label={label} inline={false}>
      <FSelect
        name={'filterByOption'}
        items={items}
        itemRenderer={filterRenderer}
        popoverProps={{ minimal: true }}
        filterable={false}
        textAccessor={'name'}
        labelAccessor={'name'}
        valueAccessor={'key'}
        className={classNames(CLASSES.SELECT_LIST_FILL_POPOVER)}
        {...restProps}
      />
    </FFormGroup>
  );
}
