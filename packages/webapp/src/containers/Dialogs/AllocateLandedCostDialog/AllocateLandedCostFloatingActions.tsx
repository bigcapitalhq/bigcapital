import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import type { AllocateLandedCostFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface AllocateLandedCostFloatingActionsProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {}

/**
 * Allocate landed cost floating actions.
 * @returns {React.JSX}
 */
function AllocateLandedCostFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}: AllocateLandedCostFloatingActionsProps) {
  // Formik context.
  const { isSubmitting } = useFormikContext<AllocateLandedCostFormValues>();

  // Allocate landed cost dialog context.
  const { dialogName, costTransactionEntry, formattedUnallocatedCostAmount } =
    useAllocateLandedConstDialogContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (_event: React.MouseEvent<HTMLElement>) => {
    closeDialog(dialogName);
  };

  return (
    <AllocateDialogFooter>
      <DialogFooterActions alignment={'left'}>
        {costTransactionEntry && (
          <UnallocatedAmount>
            <T id={'landed_cost.dialog.label_unallocated_cost_amount'} />
            <strong>{formattedUnallocatedCostAmount}</strong>
          </UnallocatedAmount>
        )}
      </DialogFooterActions>

      <DialogFooterActions alignment={'right'}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '95px' }}
          type="submit"
          loading={isSubmitting}
        >
          {<T id={'save'} />}
        </Button>
      </DialogFooterActions>
    </AllocateDialogFooter>
  );
}

export const AllocateLandedCostFloatingActions = compose(withDialogActions)(
  AllocateLandedCostFloatingActionsInner,
);

const AllocateDialogFooter = styled(DialogFooter)`
  display: flex;
`;

const UnallocatedAmount = styled.div`
  --x-color-text: #3f5278;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray1);
  }
  color: var(--x-color-text);
  align-self: center;

  strong {
    color: var(--x-color-text);
    padding-left: 4px;
  }
`;
