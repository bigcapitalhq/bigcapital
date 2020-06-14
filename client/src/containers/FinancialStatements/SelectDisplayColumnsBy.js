

import React, { useMemo, useState, useCallback } from 'react';
import SelectList from 'components/SelectList';
import {
  FormGroup,
  MenuItem,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { MODIFIER } from 'components';

export default function SelectsListColumnsBy(props) {
  const { onItemSelect, formGroupProps, selectListProps } = props;
  const [itemSelected, setItemSelected] = useState(null);

  const displayColumnsByOptions = useMemo(() => [
    {key: 'total', name: 'Total', type: 'total', by: '', },
    {key: 'year', name: 'Date/Year', type: 'date_periods', by: 'year'},
    {key: 'month', name: 'Date/Month', type: 'date_periods', by: 'month'},
    {key: 'week', name: 'Date/Week', type: 'date_periods', by: 'month'},
    {key: 'day', name: 'Date/Day', type: 'date_periods', by: 'day'},
    {key: 'quarter', name: 'Date/Quarter', type: 'date_periods', by: 'quarter'},
  ],[]);

  const itemRenderer = useCallback((item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  }, []);

  const handleItemSelect = useCallback((item) => {
    setItemSelected(item);
    onItemSelect && onItemSelect(item);
  }, [setItemSelected, onItemSelect]);

  const buttonLabel = useMemo(() => 
    itemSelected ? itemSelected.name : <T id={'select_display_columns_by'}/>,
    [itemSelected]);

  return (
    <FormGroup
      label={<T id={'display_report_columns'}/>}
      className="form-group-display-columns-by form-group--select-list bp3-fill"
      inline={false}
      {...formGroupProps}>

      <SelectList
        items={displayColumnsByOptions}
        noResults={<MenuItem disabled={true} text="No results." />}
        filterable={false}
        itemRenderer={itemRenderer}
        popoverProps={{ minimal: true, usePortal: false, inline: true }}
        buttonLabel={buttonLabel}
        onItemSelect={handleItemSelect}
        className={classNames(MODIFIER.SELECT_LIST_FILL_POPOVER)}
        {...selectListProps} />
    </FormGroup>
  );
}