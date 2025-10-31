// @ts-nocheck
import React from 'react';
import {
  Classes,
  Button,
  InputGroup,
  FormGroup,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { FormattedMessage as T, Icon } from '@/components';
import { useClipboard } from '@/hooks/utils/useClipboard';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { AppToaster } from '@/components';

/**
 * API Key Display dialog content.
 */
function ApiKeyDisplayDialogContent({
  dialogName,
  apiKey,
  // #withDialogActions
  closeDialog,
}) {
  const clipboard = useClipboard();

  const handleCopy = () => {
    if (apiKey) {
      clipboard.copy(apiKey);
      AppToaster.show({
        message: 'API key copied to clipboard',
        intent: Intent.SUCCESS,
      });
    }
  };

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <p>
          <strong>Important:</strong> This API key will only be shown once. Please copy and save it securely.
        </p>
        <FormGroup label="API Key">
          <InputGroup
            value={apiKey || ''}
            readOnly
            rightElement={
              <Tooltip content="Copy to clipboard" position={Position.TOP}>
                <Button
                  onClick={handleCopy}
                  minimal
                  icon={<Icon icon={'clipboard'} iconSize={16} />}
                />
              </Tooltip>
            }
          />
        </FormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent={Intent.PRIMARY} onClick={handleCopy}>
            <T id={'copy'} />
          </Button>
          <Button onClick={handleClose}>
            <T id={'close'} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default compose(withDialogActions)(ApiKeyDisplayDialogContent);
