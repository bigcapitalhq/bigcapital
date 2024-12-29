// @ts-nocheck
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import clsx from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  TotalLinePrimitive,
} from '@/components';

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

interface AdjustmentTotalLineProps {
  adjustmentAmount: number;
}

export function AdjustmentTotalLine({
  adjustmentAmount,
}: AdjustmentTotalLineProps) {
  return (
    <TotalLinePrimitive>
      <x.div
        display={'table-cell'}
        padding={'8px'}
        borderBottom={'1px solid rgb(210, 221, 226)'}
      >
        <x.div
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <x.span>Adjustment</x.span>
          <FFormGroup
            name={'adjustment'}
            label={''}
            inline
            fastField
            className={formGroupCss}
          >
            <FInputGroup
              name={'adjustment'}
              fastField
              className={clsx(
                inputGroupCss,
                css`
                  & .bp4-input {
                    border-style: dashed;
                  }
                `,
              )}
            />
          </FFormGroup>
        </x.div>
      </x.div>

      <x.div
        display={'table-cell'}
        borderBottom={'1px solid rgb(210, 221, 226)'}
        textAlign={'right'}
        padding={'8px'}
      >
        {adjustmentAmount}
      </x.div>
    </TotalLinePrimitive>
  );
}
