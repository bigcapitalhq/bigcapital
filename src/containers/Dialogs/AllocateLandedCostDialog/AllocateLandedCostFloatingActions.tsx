// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from '@/components';

import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Allocate landed cost floating actions.
 * @returns {React.JSX}
 */
function AllocateLandedCostFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Allocate landed cost dialog context.
  const { dialogName, costTransactionEntry, formattedUnallocatedCostAmount } =
    useAllocateLandedConstDialogContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    closeDialog(dialogName);
  };

  return (
    <AllocateDialogFooter>
      <DialogFooterActions alignment={'left'}>
        {costTransactionEntry && (
          <UnallocatedAmount>
           <T id={'landed_cost.dialog.label_unallocated_cost_amount'}/>
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

export default compose(withDialogActions)(AllocateLandedCostFloatingActions);

const AllocateDialogFooter = styled(DialogFooter)`
  display: flex;
`;

const UnallocatedAmount = styled.div`
  color: #3f5278;
  align-self: center;

  strong {
    color: #353535;
    padding-left: 4px;
  }
`;
