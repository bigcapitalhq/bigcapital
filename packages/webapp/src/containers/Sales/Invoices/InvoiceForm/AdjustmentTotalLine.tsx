// @ts-nocheck
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import clsx from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  TotalLinePrimitive,
} from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

const inputGroupCss = css`
  & .bp4-input {
    max-width: 110px;
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
  const isDarkMode = useIsDarkMode();

  return (
    <TotalLinePrimitive>
      <x.div
        display={'table-cell'}
        padding={'8px'}
        borderBottom={'1px solid var(--x-border-bottom-color)'}
        style={{
          '--x-border-bottom-color': isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgb(210, 221, 226)',
        }}
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
        textAlign={'right'}
        padding={'8px'}
        borderBottom={'1px solid var(--x-border-bottom-color)'}
        style={{
          '--x-border-bottom-color': isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgb(210, 221, 226)',
        }}
      >
        {adjustmentAmount}
      </x.div>
    </TotalLinePrimitive>
  );
}
