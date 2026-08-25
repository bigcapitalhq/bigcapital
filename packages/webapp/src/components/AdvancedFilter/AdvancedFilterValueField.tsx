import { Position, Checkbox, InputGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { isUndefined } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import {
  IFieldType,
  type IFilterOption,
  type IAdvancedFilterValueField,
} from './interfaces';
import { Choose } from '@/components';
import { Select } from '@/components/Forms';
import { useAutofocus, useDateInputFormatter } from '@/hooks';

function AdvancedFilterEnumerationField({
  options,
  value,
  onItemSelect,
}: {
  options: IFilterOption[];
  value?: string | boolean;
  onItemSelect?: (option: IFilterOption) => void;
}) {
  return (
    <Select
      items={options}
      selectedValue={typeof value === 'string' ? value : undefined}
      popoverProps={{
        fill: true,
        minimal: true,
        captureDismiss: true,
      }}
      placeholder={intl.get('filter.select_option')}
      textAccessor={'label'}
      valueAccessor={'key'}
      onItemChange={(option: IFilterOption) => onItemSelect?.(option)}
    />
  );
}

function tansformDateValue(
  date: string | boolean | undefined,
  defaultValue = null,
) {
  return date ? moment(date as string).toDate() : defaultValue;
}
/**
 * Advanced filter value field detarminer.
 */
export default function AdvancedFilterValueField({
  value,
  fieldType,
  options,
  onChange,
  isFocus,
}: IAdvancedFilterValueField) {
  const [localValue, setLocalValue] = React.useState(value);
  const dateInputFormatter = useDateInputFormatter();

  React.useEffect(() => {
    if (localValue !== value && !isUndefined(value)) {
      setLocalValue(value);
    }
  }, [localValue, value]);

  // Input field reference.
  const valueRef = useAutofocus(isFocus ?? false);

  const triggerOnChange = (next: string | boolean) =>
    onChange && onChange(next);

  // Handle input change.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
  ) => {
    const target = e.currentTarget;
    if (target.type === 'checkbox') {
      const checked = (target as HTMLInputElement).checked;
      setLocalValue(checked);
      triggerOnChange(checked);
    } else {
      setLocalValue(target.value);
      triggerOnChange(target.value);
    }
  };

  // Handle enumeration field type change.
  const handleEnumerationChange = (option: IFilterOption) => {
    setLocalValue(option.key);
    triggerOnChange(option.key);
  };

  // Handle date field change.
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const formattedDate = moment(date).format('YYYY/MM/DD');

    setLocalValue(formattedDate);
    triggerOnChange(formattedDate);
  };

  return (
    <Choose>
      <Choose.When condition={fieldType === IFieldType.ENUMERATION}>
        <AdvancedFilterEnumerationField
          options={options ?? []}
          value={localValue}
          onItemSelect={handleEnumerationChange}
        />
      </Choose.When>

      <Choose.When condition={fieldType === IFieldType.DATE}>
        <DateInput
          {...dateInputFormatter}
          value={tansformDateValue(localValue)}
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
        <Checkbox checked={localValue === true} onChange={handleInputChange} />
      </Choose.When>

      <Choose.Otherwise>
        <InputGroup
          placeholder={intl.get('filter.value')}
          onChange={handleInputChange}
          value={typeof localValue === 'string' ? localValue : ''}
          inputRef={valueRef}
        />
      </Choose.Otherwise>
    </Choose>
  );
}
