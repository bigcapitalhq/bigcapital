import { Button, Classes } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { MfaStepLinks, MfaStepText, MfaStepTitle } from './MfaStepLayout';
import type { MfaMethodDescriptor, MfaMethodId } from './types';

const METHOD_LABEL_KEYS: Record<MfaMethodId, string> = {
  totp: 'mfa.method_totp',
  recovery_code: 'mfa.method_recovery_code',
  email_otp: 'mfa.method_email_otp',
  webauthn: 'mfa.method_webauthn',
};

const METHOD_HINT_KEYS: Record<MfaMethodId, string> = {
  totp: 'mfa.method_totp_hint',
  recovery_code: 'mfa.method_recovery_code_hint',
  email_otp: 'mfa.method_email_otp_hint',
  webauthn: 'mfa.method_webauthn_hint',
};

interface MfaMethodPickerProps {
  title: string;
  hint: string;
  methods: MfaMethodDescriptor[];
  onSelect: (methodId: MfaMethodId) => void;
  onRestart: () => void;
}

/**
 * Shown only when more than one method can be used for the challenge. A single
 * method goes straight to its form.
 */
export function MfaMethodPicker({
  title,
  hint,
  methods,
  onSelect,
  onRestart,
}: MfaMethodPickerProps) {
  return (
    <div>
      <MfaStepTitle>{title}</MfaStepTitle>
      <MfaStepText className={Classes.TEXT_MUTED}>{hint}</MfaStepText>

      <MethodList>
        {methods.map((method) => (
          <MethodButton
            key={method.id}
            type={'button'}
            onClick={() => onSelect(method.id)}
            data-testId={`mfa-method-${method.id}`}
          >
            <MethodName>{intl.get(METHOD_LABEL_KEYS[method.id])}</MethodName>
            <MethodHint>{intl.get(METHOD_HINT_KEYS[method.id])}</MethodHint>
          </MethodButton>
        ))}
      </MethodList>

      <MfaStepLinks>
        <Button minimal small onClick={onRestart}>
          {intl.get('two_factor.back_to_signin')}
        </Button>
      </MfaStepLinks>
    </div>
  );
}

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MethodButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  border: 1px solid var(--x-color-border, #d5d5d5);
  border-radius: 3px;
  background: transparent;
  color: inherit;

  &:hover {
    border-color: #106ba3;
  }
`;

const MethodName = styled.span`
  display: block;
  font-weight: 500;
`;

const MethodHint = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
`;
