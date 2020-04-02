

import React, {useMemo, useCallback} from 'react';
import SelectList from 'components/SelectList';
import {
  FormGroup,
  MenuItem,
} from '@blueprintjs/core';

export default function SelectsListColumnsBy(props) {
  const { formGroupProps, selectListProps } = props;

  const displayColumnsByOptions = useMemo(() => [
    {key: 'total', name: 'Total', type: 'total', by: '', },
    {key: 'year', name: 'Year', type: 'date', by: 'year'},
    {key: 'month', name: 'Month', type: 'date', by: 'month'},
    {key: 'week', name: 'Week', type: 'date', by: 'month'},
    {key: 'day', name: 'Day', type: 'date', by: 'day'},
    {key: 'quarter', name: 'Quarter', type: 'date', by: 'quarter'},
  ]);

  const itemRenderer = useCallback((item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  }, []);

  return (
    <FormGroup
      label={'Display report columns'}
      className="form-group-display-columns-by form-group--select-list bp3-fill"
      inline={false}
      {...formGroupProps}>

      <SelectList
        items={displayColumnsByOptions}
        noResults={<MenuItem disabled={true} text="No results." />}
        filterable={false}
        itemRenderer={itemRenderer}
        popoverProps={{ minimal: true }}
        buttonLabel={'Select...'}
        {...selectListProps} />
    </FormGroup>
  );
}