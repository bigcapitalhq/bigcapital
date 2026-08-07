import {
  PopoverInteractionKind,
  Tooltip,
  MenuItem,
  Position,
  PopperModifiers,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { filterAccountsOptions } from './constants';
import {
  FFormGroup,
  FSelect,
  MODIFIER,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';

interface FilterItem {
  key: string;
  name: string;
  hint?: string;
}

interface FinancialStatementsFilterProps {
  items?: FilterItem[];
  label?: React.ReactNode;
  [key: string]: unknown;
}

const SUBMENU_POPOVER_MODIFIERS: PopperModifiers = {
  flip: { boundariesElement: 'viewport', padding: 20 },
  offset: { offset: '0, 10' },
  preventOverflow: { boundariesElement: 'viewport' },
};

export function FinancialStatementsFilter({
  items = filterAccountsOptions as FilterItem[],
  label = <T id={'filter_accounts'} />,
  ...restProps
}: FinancialStatementsFilterProps) {
  const filterRenderer = (
    item: FilterItem,
    { handleClick }: { handleClick: () => void },
  ) => {
    return (
      <Tooltip
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.RIGHT_TOP}
        content={item.hint}
        modifiers={SUBMENU_POPOVER_MODIFIERS}
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
