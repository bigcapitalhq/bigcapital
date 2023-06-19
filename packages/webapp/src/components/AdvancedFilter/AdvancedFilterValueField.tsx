// @ts-nocheck
import React from 'react';
import { Position, Checkbox, InputGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import moment from 'moment';
import intl from 'react-intl-universal';
import { isUndefined } from 'lodash';

import { useAutofocus } from '@/hooks';
import { T, Choose, ListSelect } from '@/components';
import { momentFormatter } from '@/utils';

function AdvancedFilterEnumerationField({ options, value, ...rest }) {
  return (
    <ListSelect
      items={options}
      selectedItem={value}
      popoverProps={{
        fill: true,
        inline: true,
        minimal: true,
        captureDismiss: true,
      }}
      defaultText={<T id={'filter.select_option'} />}
      textProp={'label'}
      selectedItemProp={'key'}
      {...rest}
    />
  );
}

const IFieldType = {
  ENUMERATION: 'enumeration',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  DATE: 'date',
};

function transformDateValue(date, defaultValue = null) {
  return date ? moment(date).toDate() : defaultValue;
}
/**
 * Advanced filter value field determiner.
 */
export default function AdvancedFilterValueField2({
  value,
  fieldType,
  options,
  onChange,
  isFocus,
}) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    if (localValue !== value && !isUndefined(value)) {
      setLocalValue(value);
    }
  }, [localValue, value]);

  // Input field reference.
  const valueRef = useAutofocus(isFocus);

  const triggerOnChange = (value) => onChange && onChange(value);

  // Handle input change.
  const handleInputChange = (e) => {
    if (e.currentTarget.type === 'checkbox') {
      setLocalValue(e.currentTarget.checked);
      triggerOnChange(e.currentTarget.checked);
    } else {
      setLocalValue(e.currentTarget.value);
      triggerOnChange(e.currentTarget.value);
    }
  };

  // Handle enumeration field type change.
  const handleEnumerationChange = (option) => {
    setLocalValue(option.key);
    triggerOnChange(option.key);
  };

  // Handle date field change.
  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY/MM/DD');

    setLocalValue(formattedDate);
    triggerOnChange(formattedDate);
  };

  return (
    <Choose>
      <Choose.When condition={fieldType === IFieldType.ENUMERATION}>
        <AdvancedFilterEnumerationField
          options={options}
          value={localValue}
          onItemSelect={handleEnumerationChange}
        />
      </Choose.When>

      <Choose.When condition={fieldType === IFieldType.DATE}>
        <DateInput
          {...momentFormatter('YYYY/MM/DD')}
          value={transformDateValue(localValue)}
          onChange={handleDateChange}
          popoverProps={{
            minimal: true,
            position: Position.BOTTOM,
          }}
          shortcuts={true}
          placeholder={intl.get('filter.enter_date')}
          fill={true}
          inputProps={{
            fill: true,
          }}
        />
      </Choose.When>

      <Choose.When condition={fieldType === IFieldType.BOOLEAN}>
        <Checkbox value={localValue} onChange={handleInputChange} />
      </Choose.When>

      <Choose.Otherwise>
        <InputGroup
          placeholder={intl.get('filter.value')}
          onChange={handleInputChange}
          value={localValue}
          inputRef={valueRef}
        />
      </Choose.Otherwise>
    </Choose>
  );
}
