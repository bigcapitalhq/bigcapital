import { Button, Callout, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { AppToaster } from '@/components';
import { useClipboard } from '@/hooks/utils/useClipboard';

interface TwoFactorRecoveryCodesProps {
  codes: string[];
  /** Label of the button that leaves this view. */
  doneLabel?: React.ReactNode;
  onDone: () => void;
}

/**
 * The recovery codes, shown once, with copy and download.
 */
export function TwoFactorRecoveryCodes({
  codes,
  doneLabel,
  onDone,
}: TwoFactorRecoveryCodesProps) {
  const clipboard = useClipboard();
  const text = codes.join('\n');

  const handleCopy = () => {
    clipboard.copy(text);
    AppToaster.show({
      message: intl.get('two_factor.recovery_codes_copied'),
      intent: Intent.SUCCESS,
    });
  };

  const handleDownload = () => {
    const header = intl.get('two_factor.recovery_codes_file_header', {
      host: window.location.host,
    });
    const blob = new Blob([`${header}\n\n${text}\n`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bigcapital-recovery-codes.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testId="two-factor-recovery-codes">
      <Callout intent={Intent.WARNING} icon="key">
        {intl.get('two_factor.recovery_codes_warning')}
      </Callout>

      <CodesGrid>
        {codes.map((code) => (
          <code key={code}>{code}</code>
        ))}
      </CodesGrid>

      <Actions>
        <Button icon="clipboard" onClick={handleCopy}>
          {intl.get('two_factor.copy')}
        </Button>
        <Button icon="download" onClick={handleDownload}>
          {intl.get('two_factor.download')}
        </Button>
        <Button
          intent={Intent.PRIMARY}
          onClick={onDone}
          data-testId="two-factor-recovery-codes-done"
        >
          {doneLabel ?? intl.get('two_factor.saved_them')}
        </Button>
      </Actions>
    </div>
  );
}

const CodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 8px 24px;
  margin: 16px 0;
  font-size: 13px;

  code {
    font-family: monospace;
    letter-spacing: 0.04em;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
