import React, { useMemo, useRef, useEffect, useState } from 'react';
import { FormGroup, MenuItem, InputGroup, Position, Spinner } from '@blueprintjs/core';
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

import { compose, momentFormatter } from 'utils';

/**
 * Dynamic filter fields.
 */
function DynamicFilterValueField({
  fieldMeta,
  value,
  initialValue,
  error,
  // fieldkey,
  // resourceKey,

  resourceName,
  resourceData,

  requestResourceData,

  onChange,

  inputDebounceWait = 500,
}) {
  const { formatMessage } = useIntl();
  const [localValue, setLocalValue] = useState();


  const fetchResourceData = useQuery(
    ['resource-data', resourceName],
    () => requestResourceData(resourceName),
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
    fetchResourceData.refetch({ force: true });
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
    setLocalValue(e.currentTarget.value);
    handleInputChangeThrottled.current(e.currentTarget.value);
  };

  const handleDateChange = (date) => {
    setLocalValue(date);
    onChange && onChange(date);
  };

  const transformDateValue = (value) => {
    return moment(value || new Date()).toDate();
  };
  return (
    <FormGroup className={'form-group--value'}>
      <Choose>
        <Choose.When condition={true}>
          <Spinner size={18} /> 
        </Choose.When>

        <Choose.Otherwise>
            <Choose>
            <Choose.When condition={fieldMeta.data_type === 'options'}>
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

            <Choose.When condition={fieldMeta.data_type === 'date'}>
              <DateInput
                {...momentFormatter('YYYY/MM/DD')}
                value={transformDateValue(localValue)}
                onChange={handleDateChange}
                popoverProps={{
                  minimal: true,
                  position: Position.BOTTOM,
                }}
              />
            </Choose.When>

            <Choose.Otherwise>
              <InputGroup
                placeholder={formatMessage({ id: 'value' })}
                onChange={handleInputChange}
                value={localValue}
              />
            </Choose.Otherwise>
          </Choose>
        </Choose.Otherwise>
      </Choose>
    </FormGroup>
  );
}

const mapStateToProps = (state, props) => ({
  resourceName: props.fieldMeta.resource_key || 'account_type',
});

const withResourceFilterValueField = connect(mapStateToProps);

export default compose(
  withResourceFilterValueField,
  withResourceDetail(({ resourceData }) => ({ resourceData })),
  withResourceActions,
)(DynamicFilterValueField);
