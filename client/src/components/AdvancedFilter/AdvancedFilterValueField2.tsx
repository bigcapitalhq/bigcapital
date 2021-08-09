import React from 'react';
import { Position, Checkbox, InputGroup, FormGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Choose, ListSelect } from 'components';
import { momentFormatter, tansformDateValue } from 'utils';
import { IFieldType, IAdvancedFilterValueField } from './interfaces';

function AdvancedFilterEnumerationField({ options, value, ...rest }) {
  return (
    <ListSelect
      items={options}
      selectedItem={value}
      popoverProps={{
        inline: true,
        minimal: true,
        captureDismiss: true,
      }}
      defaultText={`Select an option`}
      textProp={'label'}
      selectedItemProp={'key'}
      {...rest}
    />
  );
}

/**
 * Advanced filter value field detarminer.
 */
export default function AdvancedFilterValueField2({
  fieldType,
  options,
  onChange,
}: IAdvancedFilterValueField) {
  const [localValue, setLocalValue] = React.useState<string>('');

  const triggerOnChange = (value: string) => onChange && onChange(value);

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
  const handleDateChange = (date: Date) => {
    const formattedDate: string = moment(date).format('YYYY/MM/DD');

    setLocalValue(formattedDate);
    triggerOnChange(formattedDate);
  };

  return (
    <FormGroup className={'form-group--value'}>
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
            value={tansformDateValue(localValue)}
            onChange={handleDateChange}
            popoverProps={{
              minimal: true,
              position: Position.BOTTOM,
            }}
            shortcuts={true}
            placeholder={'Select date'}
          />
        </Choose.When>

        <Choose.When condition={fieldType === IFieldType.BOOLEAN}>
          <Checkbox value={localValue} onChange={handleInputChange} />
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
