import {
  Classes,
  Button,
  InputGroup,
  FormGroup,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, Icon, Alert as AlertBase } from '@/components';
import { AppToaster } from '@/components';
import { useClipboard } from '@/hooks/utils/useClipboard';

// Alert component is `@ts-nocheck`; widen to accept the props used here.
const Alert = AlertBase as unknown as React.FC<{
  intent?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}>;

interface ApiKeyDisplayViewProps {
  dialogName: string;
  apiKey: string;
  onClose: () => void;
}

/**
 * API Key Display view component (used within the generate dialog).
 */
export function ApiKeyDisplayView({
  apiKey,
  onClose,
}: ApiKeyDisplayViewProps): React.ReactElement {
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
          <strong>{intl.get('api_key.important')}:</strong>{' '}
          {intl.get('api_key.display_warning')}
        </Alert>
        <FormGroup label={intl.get('api_key.label')}>
          <InputGroup
            value={apiKey || ''}
            readOnly
            rightElement={
              <Tooltip
                content={intl.get('api_key.copy_to_clipboard')}
                position={Position.TOP}
              >
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
          <Button
            intent={Intent.PRIMARY}
            onClick={onClose}
            style={{ width: '85px' }}
          >
            <T id={'done'} />
          </Button>
        </div>
      </div>
    </>
  );
}
