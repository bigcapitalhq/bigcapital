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
import { FormattedMessage as T, useIntl } from 'react-intl';
import { debounce } from 'lodash';
import moment from 'moment';

import { If, Choose, ListSelect, MODIFIER } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withResourceActions from 'containers/Resources/withResourcesActions';

import {
  getConditionTypeCompatators,
  getConditionDefaultCompatator,
} from './DynamicFilterCompatators';

import { compose, momentFormatter } from 'utils';

/**
 * Dynamic filter fields.
 */
function DynamicFilterValueField({
  dataType,
  value,

  initialValue,
  error,
  // fieldkey,
  // resourceKey,

  // #withResourceDetail
  resourceName,
  resourceData,

  requestResourceData,

  onChange,
  rosourceKey,

  inputDebounceWait = 500,
}) {
  const { formatMessage } = useIntl();
  const [localValue, setLocalValue] = useState();

  const fetchResourceData = useQuery(
    ['resource-data', resourceName && resourceName],
    (k, resName) => requestResourceData(resName),
    { manual: true },
  );

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Account type item of select filed.
  const menuItem = (item, { handleClick, modifiers, query }) => {
    return <MenuItem text={item.name} key={item.id} onClick={handleClick} />;
  };

  const handleBtnClick = () => {
    fetchResourceData.refetch({});
  };

  const listOptions = useMemo(() => Object.values(resourceData), [
    resourceData,
  ]);

  // Filters accounts types items.
  const filterItems = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  const onItemSelect = (item) => {
    onChange && onChange(item);
  };

  const handleInputChangeThrottled = useRef(
    debounce((value) => {
      onChange && onChange(value);
    }, inputDebounceWait),
  );

  const handleInputChange = (e) => {
    if (e.currentTarget.type === 'checkbox') {
      setLocalValue(e.currentTarget.checked);
    } else {
      setLocalValue(e.currentTarget.value);
    }
    handleInputChangeThrottled.current(e.currentTarget.value);
  };

  const handleCheckboxChange = (e) => {
    const value = !!e.currentTarget.checked;
    setLocalValue(value);
    onChange && onChange(value);
  }

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
        <Choose.When condition={dataType === 'options'}>
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
            selectedItemProp={'id'}
            defaultText={<T id={'select_account_type'} />}
            labelProp={'name'}
            buttonProps={{ onClick: handleBtnClick }}
          />
        </Choose.When>

        <Choose.When condition={dataType === 'date'}>
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

        <Choose.When condition={dataType === 'boolean'}>
          <Checkbox value={localValue} onChange={handleCheckboxChange} />
        </Choose.When>

        <Choose.Otherwise>
          <InputGroup
            placeholder={formatMessage({ id: 'value' })}
            onChange={handleInputChange}
            value={localValue}
          />
        </Choose.Otherwise>
      </Choose>
    </FormGroup>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: props.dataResource,
});

const withResourceFilterValueField = connect(mapStateToProps);

export default compose(
  withResourceFilterValueField,
  withResourceDetail(({ resourceData }) => ({ resourceData })),
  withResourceActions,
)(DynamicFilterValueField);
