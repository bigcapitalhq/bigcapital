// @ts-nocheck
import React from 'react';

import { Button, Intent } from '@blueprintjs/core';
import { Icon, FormattedMessage as T } from '@/components';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

function ApiKeysActionsInner({ openDialog, closeDialog }) {
  const onClickGenerateApiKey = () => {
    openDialog('api-keys-generate');
  };

  return (
    <div className="preferences-actions">
      <Button
        icon={<Icon icon="plus" iconSize={12} />}
        onClick={onClickGenerateApiKey}
        intent={Intent.PRIMARY}
      >
        <T id={'api_key.generate_button'} />
      </Button>
    </div>
  );
}

export const ApiKeysActions = flow(withDialogActions)(
  ApiKeysActionsInner,
);
