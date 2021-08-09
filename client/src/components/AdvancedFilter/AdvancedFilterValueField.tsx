import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  FormGroup,
  MenuItem,
  InputGroup,
  Position,
  Checkbox,
} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { debounce } from 'lodash';
import moment from 'moment';

import { Choose, ListSelect, MODIFIER } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withResourceActions from 'containers/Resources/withResourcesActions';

import { compose, momentFormatter } from 'utils';

/**
 * Dynamic filter fields.
 */
function DynamicFilterValueField({

  // #withResourceDetail
  resourceName,
  resourceData = [],

  requestResourceData,

  // #ownProps
  fieldType,
  fieldName,
  value,
  initialValue,
  error,
  optionsResource,
  optionsKey = 'key',
  optionsLabel = 'label',
  options,
  onChange,
  inputDebounceWait = 250,
}) {
  
  const [localValue, setLocalValue] = useState();

  // Makes `localValue` controlled mode from `value`.
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Fetches resource data.
  const fetchResourceData = useQuery(
    ['resource-data', resourceName],
    (key, _resourceName) => requestResourceData(_resourceName),
    {
      enabled: resourceName,
    },
  );
 
  // Account type item of select filed.
  const menuItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem
      text={item[optionsLabel]}
      key={item[optionsKey]}
      onClick={handleClick}
    />);
  };

  // Handle list button click.
  const handleBtnClick = () => {
    
  };

  const listOptions = useMemo(() => [
    ...(resourceData || []),
    ...(options || []),
  ], [
    resourceData, options,
  ]);

  // Filters accounts types items.
  const filterItems = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.label.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  // Handle list item selected.
  const onItemSelect = (item) => {
    onChange && onChange(item[optionsKey]);
  };

  const handleInputChangeThrottled = useRef(
    debounce((value) => { onChange && onChange(value); }, inputDebounceWait),
  );

  // Handle input change.
  const handleInputChange = (e) => {
    if (e.currentTarget.type === 'checkbox') {
      setLocalValue(e.currentTarget.checked);
    } else {
      setLocalValue(e.currentTarget.value);
    }
    handleInputChangeThrottled.current(e.currentTarget.value);
  };

  // Handle checkbox field change.
  const handleCheckboxChange = (e) => {
    const value = !!e.currentTarget.checked;
    setLocalValue(value);
    onChange && onChange(value);
  }

  // Handle date field change.
  const handleDateChange = (date) => {
    setLocalValue(date);
    onChange && onChange(date);
  };

  const transformDateValue = (value) => {
    return value ? moment(value || new Date()).toDate() : null;
  };

  return (
    <FormGroup className={'form-group--value'}>
      <Choose>
        <Choose.When condition={fieldType === 'options'}>
          <ListSelect
            className={classNames(
              'list-select--filter-dropdown',
              'form-group--select-list',
              MODIFIER.SELECT_LIST_FILL_POPOVER,
              MODIFIER.SELECT_LIST_FILL_BUTTON,
            )}
            items={listOptions}
            itemRenderer={menuItem}
            loading={fetchResourceData.isFetching}
            itemPredicate={filterItems}
            popoverProps={{
              inline: true,
              minimal: true,
              captureDismiss: true,
              popoverClassName: 'popover--list-select-filter-dropdown',
            }}
            onItemSelect={onItemSelect}
            selectedItem={value}
            selectedItemProp={optionsKey}
            defaultText={`Select an option`}
            textProp={optionsLabel}
            buttonProps={{
              onClick: handleBtnClick
            }}
          />
        </Choose.When>

        <Choose.When condition={fieldType === 'date'}>
          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            value={transformDateValue(localValue)}
            onChange={handleDateChange}
            popoverProps={{
              minimal: true,
              position: Position.BOTTOM,
            }}
            shortcuts={true}
            placeholder={'Select date'}
          />
        </Choose.When>

        <Choose.When condition={fieldType === 'checkbox'}>
          <Checkbox value={localValue} onChange={handleCheckboxChange} />
        </Choose.When>

        <Choose.Otherwise>
          <InputGroup
            placeholder={intl.get('value')}
            onChange={handleInputChange}
            value={localValue}
          />
        </Choose.Otherwise>
      </Choose>
    </FormGroup>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: props.optionsResource,
});

const withResourceFilterValueField = connect(mapStateToProps);

export default compose(
  withResourceFilterValueField,
  withResourceDetail(({ resourceData }) => ({ resourceData })),
  withResourceActions,
)(DynamicFilterValueField);
