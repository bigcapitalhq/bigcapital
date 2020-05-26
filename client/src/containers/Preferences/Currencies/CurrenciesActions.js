import React, {useCallback} from 'react';
import {
  Button,
  Intent,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import DialogConnect from 'connectors/Dialog.connector';
import {compose} from 'utils';

function CurrenciesActions({
  openDialog,
}) {
  const handleClickNewCurrency = useCallback(() => {
    openDialog('currency-form');
  }, [openDialog]);

  return (
    <div class="users-actions">
      <Button
        icon={<Icon icon='plus' iconSize={12} />}
        onClick={handleClickNewCurrency}
        intent={Intent.PRIMARY}>
        New Currency
      </Button>
    </div>    
  );
}

export default compose(
  DialogConnect,
)(CurrenciesActions);