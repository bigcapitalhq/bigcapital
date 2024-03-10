// @ts-nocheck
import { useState } from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import {
  Button,
  Classes,
  ControlGroup,
  Intent,
  Popover,
  Position,
  Spinner,
} from '@blueprintjs/core';
import { FlagIcon } from '../Tags';
import { FMoneyInputGroup, FFormGroup } from '../Forms';
import { useUncontrolled } from '@/hooks/useUncontrolled';

interface ExchangeRateValuesBag {
  oldExchangeRate: string;
  exchangeRate: string;
}

interface ExchangeRateInputGroupProps {
  name: string;
  fromCurrency: string;
  toCurrency: string;
  isLoading?: boolean;

  inputGroupProps?: any;
  formGroupProps?: any;

  withPopoverRecalcConfirm?: boolean;

  onRecalcConfirm: (bag: ExchangeRateValuesBag) => void;
  onCancel: (bag: ExchangeRateValuesBag) => void;

  isConfirmPopoverOpen?: boolean;
  initialConfirmPopoverOpen?: boolean;
  onConfirmPopoverOpen?: (isOpen: boolean) => void;
}

export function ExchangeRateInputGroup({
  name,
  fromCurrency,
  toCurrency,
  isLoading,

  inputGroupProps,
  formGroupProps,

  withPopoverRecalcConfirm = false,

  onRecalcConfirm,
  onCancel,

  isConfirmPopoverOpen,
  initialConfirmPopoverOpen,
  onConfirmPopoverOpen,
}: ExchangeRateInputGroupProps) {
  const [isOpen, handlePopoverOpen] = useUncontrolled<boolean>({
    value: isConfirmPopoverOpen,
    initialValue: initialConfirmPopoverOpen,
    finalValue: false,
    onChange: onConfirmPopoverOpen,
  });
  const { values, setFieldValue } = useFormikContext();
  const [oldExchangeRate, setOldExchangeRate] = useState<string>('');

  const exchangeRate = values[name];
  const exchangeRateValuesBag: ExchangeRateValuesBag = {
    exchangeRate,
    oldExchangeRate,
  };
  // Handle re-calc confirm button click.
  const handleRecalcConfirmBtn = () => {
    handlePopoverOpen(false);
    onRecalcConfirm && onRecalcConfirm(exchangeRateValuesBag);
  };
  // Handle cancel button click.
  const handleCancelBtn = () => {
    handlePopoverOpen(false);
    onCancel && onCancel(exchangeRateValuesBag);
  };
  // Handle exchange rate field blur.
  const handleExchangeRateFieldBlur = (value: string) => {
    if (value !== values[name]) {
      handlePopoverOpen(true);
      setFieldValue(name, value);
      setOldExchangeRate(values[name]);
    }
  };

  const exchangeRateField = (
    <ExchangeRateField
      allowDecimals={true}
      allowNegativeValue={true}
      asyncControl={true}
      onChange={() => null}
      onBlur={handleExchangeRateFieldBlur}
      rightElement={isLoading && <Spinner size={16} />}
      decimalsLimit={5}
      {...inputGroupProps}
      name={name}
    />
  );

  const popoverConfirmContent = (
    <PopoverContent>
      <p>
        Are you want to re-calculate item prices based on this exchange rate.
      </p>
      <div
        style={{
          display: 'flex',
          marginTop: 15,
        }}
      >
        <Button
          intent={Intent.WARNING}
          className={Classes.POPOVER_DISMISS}
          onClick={handleRecalcConfirmBtn}
          small
        >
          Calculate
        </Button>
        <Button
          className={Classes.POPOVER_DISMISS}
          style={{ marginRight: 10 }}
          onClick={handleCancelBtn}
          small
          minimal
        >
          Cancel
        </Button>
      </div>
    </PopoverContent>
  );

  return (
    <FFormGroup inline={true} {...formGroupProps} name={name}>
      <ControlGroup>
        <ExchangeRatePrepend>
          <ExchangeFlagIcon currencyCode={fromCurrency} /> 1 {fromCurrency} =
        </ExchangeRatePrepend>

        {withPopoverRecalcConfirm ? (
          <Popover
            isOpen={isOpen}
            content={popoverConfirmContent}
            position={Position.RIGHT}
          >
            {exchangeRateField}
          </Popover>
        ) : (
          exchangeRateField
        )}
        <ExchangeRateAppend>
          <ExchangeFlagIcon currencyCode={toCurrency} /> {toCurrency}
        </ExchangeRateAppend>
      </ControlGroup>
    </FFormGroup>
  );
}

const ExchangeRateField = styled(FMoneyInputGroup)`
  max-width: 85px;
`;

const ExchangeRateSideIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 1;
`;

const ExchangeRatePrepend = styled(ExchangeRateSideIcon)`
  padding-right: 8px;
`;

const ExchangeRateAppend = styled(ExchangeRateSideIcon)`
  padding-left: 8px;
`;

const ExchangeFlagIcon = styled(FlagIcon)`
  margin-right: 5px;
  margin-left: 5px;
  display: inline-block;
`;

const PopoverContent = styled('div')`
  padding: 20px;
  width: 300px;
`;
