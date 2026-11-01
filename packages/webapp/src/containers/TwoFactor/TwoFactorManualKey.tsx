import { Button, FormGroup, InputGroup, Intent, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, Icon } from '@/components';
import { useClipboard } from '@/hooks/utils/useClipboard';

interface TwoFactorManualKeyProps {
  secret: string;
}

/**
 * The secret in groups of four, for entering it in the app by hand.
 */
export function TwoFactorManualKey({ secret }: TwoFactorManualKeyProps) {
  const clipboard = useClipboard();
  const grouped = secret.replace(/(.{4})(?=.)/g, '$1 ');

  const handleCopy = () => {
    clipboard.copy(secret);
    AppToaster.show({
      message: intl.get('two_factor.key_copied'),
      intent: Intent.SUCCESS,
    });
  };

  return (
    <FormGroup label={intl.get('two_factor.manual_key')}>
      <InputGroup
        value={grouped}
        readOnly
        style={{ fontFamily: 'monospace', fontSize: '12px' }}
        data-testId="two-factor-manual-key"
        rightElement={
          <Tooltip
            content={intl.get('two_factor.copy_key')}
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
  );
}
