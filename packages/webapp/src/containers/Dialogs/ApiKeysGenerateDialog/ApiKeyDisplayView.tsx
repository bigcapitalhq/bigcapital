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
import intl from 'react-intl-universal';
import { FormattedMessage as T, Icon, Alert } from '@/components';
import { useClipboard } from '@/hooks/utils/useClipboard';
import { AppToaster } from '@/components';

/**
 * API Key Display view component (used within the generate dialog).
 */
function ApiKeyDisplayView({
  dialogName,
  apiKey,
  onClose,
}) {
  const clipboard = useClipboard();

  const handleCopy = () => {
    if (apiKey) {
      clipboard.copy(apiKey);
      AppToaster.show({
        message: intl.get('api_key.copied_to_clipboard'),
        intent: Intent.SUCCESS,
      });
    }
  };

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <Alert intent="primary">
          <strong>{intl.get('api_key.important')}:</strong> {intl.get('api_key.display_warning')}
        </Alert>
        <FormGroup label={intl.get('api_key.label')}>
          <InputGroup
            value={apiKey || ''}
            readOnly
            rightElement={
              <Tooltip content={intl.get('api_key.copy_to_clipboard')} position={Position.TOP}>
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
          <Button intent={Intent.PRIMARY} onClick={onClose} style={{ width: '85px' }}>
            <T id={'done'} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ApiKeyDisplayView;

