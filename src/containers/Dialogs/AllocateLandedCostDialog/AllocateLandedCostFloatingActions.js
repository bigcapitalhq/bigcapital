import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import {
  DialogFooter,
  DialogFooterActions,
  FormattedMessage as T,
} from 'components';

import { useAllocateLandedConstDialogContext } from './AllocateLandedCostDialogProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function AllocateLandedCostFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();
  const { dialogName, costTransactionEntry, formattedUnallocatedCostAmount } =
    useAllocateLandedConstDialogContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    closeDialog(dialogName);
  };

  return (
    <DialogFooter>
      <DialogFooterActions alignment={'left'}>
        {costTransactionEntry && (
          <UnallocatedAmount>
            Unallocated cost Amount:{' '}
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
          style={{ minWidth: '100px' }}
          type="submit"
          loading={isSubmitting}
        >
          {<T id={'save'} />}
        </Button>
      </DialogFooterActions>
    </DialogFooter>
  );
}

export default compose(withDialogActions)(AllocateLandedCostFloatingActions);

const UnallocatedAmount = styled.div`
  color: #3f5278;
  align-self: center;

  strong {
    color: #353535;
    padding-left: 4px;
  }
`;
