import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import Icon from '@/components/Icon';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';
import { FormattedMessage as T } from '@/components';

function CurrenciesActions({ openDialog }) {
  const handleClickNewCurrency = useCallback(() => {
    openDialog('currency-form');
  }, [openDialog]);

  return (
    <div class="users-actions">
      <Button
        icon={<Icon icon="plus" iconSize={12} />}
        onClick={handleClickNewCurrency}
        intent={Intent.PRIMARY}
      >
        <T id={'new_currency'} />
      </Button>
    </div>
  );
}

export default compose(withDialogActions)(CurrenciesActions);
