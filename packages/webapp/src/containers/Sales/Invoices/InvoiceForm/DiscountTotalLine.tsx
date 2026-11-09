import { Button } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import type { CSSProperties } from 'react';
import {
  FFormGroup,
  FInputGroup,
  FSelect,
  TotalLinePrimitive,
} from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

const borderColorStyle = (isDarkMode: boolean): CSSProperties =>
  ({
    '--x-border-bottom-color': isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgb(210, 221, 226)',
  }) as CSSProperties;

const inputGroupCss = css`
  & .bp4-input {
    max-width: 110px;
    padding-left: 8px;
  }
`;
const formGroupCss = css`
  margin-bottom: 0;
`;

interface DiscountTotalLineProps {
  currencyCode: string;
  discountAmount: string | number;
}

export function DiscountTotalLine({
  currencyCode,
  discountAmount,
}: DiscountTotalLineProps) {
  const discountButtonInput = ({ text }: { text: string }) => (
    <Button
      small
      minimal
      className={css`
        &.bp4-small {
          font-size: 12px;
        }
      `}
    >
      {text}
    </Button>
  );

  const discountTypeItems = [
    { text: currencyCode, value: 'amount', label: 'Fixed Amount' },
    { text: '%', value: 'percentage', label: 'Percentage' },
  ];

  const isDarkMode = useIsDarkMode();

  return (
    <TotalLinePrimitive>
      <TotalLinePrimitive.Title
        borderBottom={'1px solid var(--x-border-bottom-color)'}
        style={borderColorStyle(isDarkMode)}
      >
        <x.div
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <x.span pr={2}>Discount</x.span>
          <FFormGroup
            name={'discount'}
            className={formGroupCss}
            inline
            fastField
          >
            <FInputGroup
              name={'discount'}
              rightElement={
                <FSelect
                  name={'discountType'}
                  items={discountTypeItems}
                  input={discountButtonInput}
                  filterable={false}
                />
              }
              fastField
              className={inputGroupCss}
            />
          </FFormGroup>
        </x.div>
      </TotalLinePrimitive.Title>

      <TotalLinePrimitive.Amount
        textAlign={'right'}
        borderBottom={'1px solid var(--x-border-bottom-color)'}
        style={borderColorStyle(isDarkMode)}
      >
        {discountAmount}
      </TotalLinePrimitive.Amount>
    </TotalLinePrimitive>
  );
}
