import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { Icon, FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

type ApiKeysActionsInnerProps = Pick<WithDialogActionsProps, 'openDialog'>;

function ApiKeysActionsInner({ openDialog }: ApiKeysActionsInnerProps) {
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

export const ApiKeysActions = FF.pipe(ApiKeysActionsInner, withDialogActions);
