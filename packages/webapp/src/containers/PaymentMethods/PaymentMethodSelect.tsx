import { Group } from '@/components';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Checkbox, Text } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface PaymentMethodSelectProps {
  label: string;
  value?: boolean;
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}
export function PaymentMethodSelect({
  value,
  initialValue,
  onChange,
  label,
}: PaymentMethodSelectProps) {
  const [_value, handleChange] = useUncontrolled<boolean>({
    value,
    initialValue,
    finalValue: false,
    onChange,
  });
  const handleClick = () => {
    handleChange(!_value);
  };

  return (
    <PaymentMethodSelectRoot onClick={handleClick}>
      <PaymentMethodCheckbox
        label={''}
        checked={_value}
        onClick={handleClick}
      />
      <PaymentMethodText>{label}</PaymentMethodText>
    </PaymentMethodSelectRoot>
  );
}

export interface PaymentMethodSelectFieldProps
  extends Partial<PaymentMethodSelectProps> {
  label: string;
  name: string;
}

export function PaymentMethodSelectField({
  name,
  ...props
}: PaymentMethodSelectFieldProps) {
  const { values, setFieldValue } = useFormikContext();
  const value = useMemo(() => get(values, name), [values, name]);

  const handleChange = (newValue: boolean) => {
    setFieldValue(name, newValue);
  };

  return (
    <PaymentMethodSelect value={value} onChange={handleChange} {...props} />
  );
}

const PaymentMethodSelectRoot = styled(Group)`
  --x-color-border: #d3d8de;

  .bp4-dark & {
    --x-color-border: rgba(255, 255, 255, 0.2);
  }
  border: 1px solid var(--x-color-border);
  border-radius: 3px;
  padding: 8px;
  gap: 0;
  min-width: 200px;
  cursor: pointer;
`;

const PaymentMethodCheckbox = styled(Checkbox)`
  --x-color-border: #c5cbd3;

  .bp4-dark & {
    --x-color-border: rgba(255, 255, 255, 0.2);
  }
  margin: 0;

  &.bp4-control .bp4-control-indicator {
    box-shadow: 0 0 0 1px var(--x-color-border);
  }
`;

const PaymentMethodText = styled(Text)`
  --x-color-text: #404854;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  color: var(--x-color-text);
`;
