// @ts-nocheck
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import {
  FFormGroup,
  FInputGroup,
  FSelect,
  TotalLinePrimitive,
} from '@/components';
import { Button } from '@blueprintjs/core';

const inputGroupCss = css`
  & .bp4-input {
    max-width: 110px;
    color: rgb(17, 17, 17);
    padding-left: 8px;
  }
`;
const formGroupCss = css`
  margin-bottom: 0;
`;

interface DiscountTotalLineProps {
  currencyCode: string;
  discountAmount: number;
}

export function DiscountTotalLine({
  currencyCode,
  discountAmount,
}: DiscountTotalLineProps) {
  const discountButtonInput = ({ text }) => (
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

  return (
    <TotalLinePrimitive>
      <TotalLinePrimitive.Title borderBottom={'1px solid rgb(210, 221, 226)'}>
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
                  name={'discount_type'}
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
        borderBottom={'1px solid rgb(210, 221, 226)'}
      >
        {discountAmount}
      </TotalLinePrimitive.Amount>
    </TotalLinePrimitive>
  );
}
