import { Button, Intent } from '@blueprintjs/core';
import React, { useCallback } from 'react';
import { Icon, FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type CurrenciesActionsInnerProps = Pick<WithDialogActionsProps, 'openDialog'>;

function CurrenciesActionsInner({ openDialog }: CurrenciesActionsInnerProps) {
  const handleClickNewCurrency = useCallback(() => {
    openDialog('currency-form');
  }, [openDialog]);

  return (
    <div className="users-actions">
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

export const CurrenciesActions = compose(withDialogActions)(
  CurrenciesActionsInner,
);
