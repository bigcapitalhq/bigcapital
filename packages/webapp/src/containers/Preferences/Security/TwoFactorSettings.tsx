import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import moment from 'moment';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { AppToaster } from '@/components';
import { TwoFactorManualKey } from '@/containers/TwoFactor/TwoFactorManualKey';
import { TwoFactorQrCode } from '@/containers/TwoFactor/TwoFactorQrCode';
import { TwoFactorRecoveryCodes } from '@/containers/TwoFactor/TwoFactorRecoveryCodes';
import {
  getTwoFactorErrorMessage,
  normalizeCodeInput,
} from '@/containers/TwoFactor/utils';
import {
  useConfirmTwoFactorSetup,
  useDisableTwoFactor,
  useRegenerateTwoFactorRecoveryCodes,
  useStartTwoFactorSetup,
  useTwoFactorStatus,
} from '@/hooks/query';

type Mode =
  | { kind: 'idle' }
  | { kind: 'setup'; secret: string; otpauthUrl: string }
  | { kind: 'codes'; codes: string[] }
  | { kind: 'regenerate' }
  | { kind: 'disable' };

const showError = (error: unknown) =>
  AppToaster.show({
    message: getTwoFactorErrorMessage(error),
    intent: Intent.DANGER,
  });

/**
 * Two-factor authentication of the signed-in user: set up (QR code and
 * confirmation), recovery codes, turning it off.
 */
export function TwoFactorSettings() {
  const { data: status, isLoading } = useTwoFactorStatus();
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  const { mutateAsync: startSetup, isPending: isStarting } =
    useStartTwoFactorSetup();

  const handleStartSetup = () => {
    startSetup()
      .then((data) =>
        setMode({
          kind: 'setup',
          secret: data.secret,
          otpauthUrl: data.otpauthUrl,
        }),
      )
      .catch(showError);
  };
  const toIdle = () => setMode({ kind: 'idle' });

  if (isLoading || !status) {
    return <Spinner size={30} />;
  }

  return (
    <Root data-testId="two-factor-settings">
      <Header>
        <h3>{intl.get('two_factor.title')}</h3>
        {status.enabled ? (
          <Tag intent={Intent.SUCCESS} minimal>
            {intl.get('two_factor.enabled')}
          </Tag>
        ) : (
          <Tag minimal>{intl.get('two_factor.not_enabled')}</Tag>
        )}
      </Header>

      {mode.kind === 'codes' && (
        <TwoFactorRecoveryCodes codes={mode.codes} onDone={toIdle} />
      )}

      {mode.kind === 'setup' && (
        <SetupStep
          secret={mode.secret}
          otpauthUrl={mode.otpauthUrl}
          onConfirmed={(codes) => setMode({ kind: 'codes', codes })}
          onCancel={toIdle}
        />
      )}

      {(mode.kind === 'regenerate' || mode.kind === 'disable') && (
        <VerifyStep
          action={mode.kind}
          onDone={(codes) => {
            if (codes) {
              setMode({ kind: 'codes', codes });
            } else {
              AppToaster.show({
                message: intl.get('two_factor.disabled_success'),
                intent: Intent.SUCCESS,
              });
              toIdle();
            }
          }}
          onCancel={toIdle}
        />
      )}

      {mode.kind === 'idle' && !status.enabled && (
        <>
          <Text className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.description')}
          </Text>
          <Text className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.api_keys_note')}
          </Text>
          <Button
            intent={Intent.PRIMARY}
            onClick={handleStartSetup}
            loading={isStarting}
            data-testId="two-factor-setup-start"
          >
            {intl.get('two_factor.setup_button')}
          </Button>
        </>
      )}

      {mode.kind === 'idle' && status.enabled && (
        <>
          <Text>
            {intl.get('two_factor.enabled_since', {
              date: moment(status.enabledAt).format('LL'),
            })}
          </Text>
          <Text className={Classes.TEXT_MUTED}>
            {intl.get('two_factor.recovery_codes_remaining', {
              count: status.recoveryCodesRemaining,
            })}
          </Text>
          <Actions>
            <Button onClick={() => setMode({ kind: 'regenerate' })}>
              {intl.get('two_factor.regenerate_button')}
            </Button>
            <Button
              intent={Intent.DANGER}
              minimal
              onClick={() => setMode({ kind: 'disable' })}
            >
              {intl.get('two_factor.disable_button')}
            </Button>
          </Actions>
        </>
      )}
    </Root>
  );
}

interface SetupStepProps {
  secret: string;
  otpauthUrl: string;
  onConfirmed: (codes: string[]) => void;
  onCancel: () => void;
}

/**
 * Scan the QR code, enter a code to confirm.
 */
function SetupStep({ secret, otpauthUrl, onConfirmed, onCancel }: SetupStepProps) {
  const [code, setCode] = useState('');
  const { mutateAsync: confirm, isPending } = useConfirmTwoFactorSetup();

  const handleConfirm = (event: React.FormEvent) => {
    event.preventDefault();
    confirm({ code })
      .then((data) => onConfirmed(data.recoveryCodes))
      .catch((error) => {
        setCode('');
        showError(error);
      });
  };

  return (
    <form onSubmit={handleConfirm}>
      <Text>{intl.get('two_factor.setup_scan')}</Text>
      <SetupGrid>
        <TwoFactorQrCode otpauthUrl={otpauthUrl} />
        <div>
          <TwoFactorManualKey secret={secret} />
          <FormGroup label={intl.get('two_factor.setup_enter_code')}>
            <InputGroup
              value={code}
              onChange={(event) => setCode(normalizeCodeInput(event.target.value))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              autoFocus
              data-testId="two-factor-code-input"
            />
          </FormGroup>
        </div>
      </SetupGrid>
      <Actions>
        <Button
          type="submit"
          intent={Intent.PRIMARY}
          loading={isPending}
          disabled={code.length !== 6}
          data-testId="two-factor-setup-confirm"
        >
          {intl.get('two_factor.confirm_button')}
        </Button>
        <Button minimal onClick={onCancel}>
          {intl.get('cancel')}
        </Button>
      </Actions>
    </form>
  );
}

interface VerifyStepProps {
  action: 'regenerate' | 'disable';
  onDone: (codes?: string[]) => void;
  onCancel: () => void;
}

/**
 * Password and a code (or a recovery code), to regenerate the recovery codes
 * or to turn two-factor off.
 */
function VerifyStep({ action, onDone, onCancel }: VerifyStepProps) {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const regenerate = useRegenerateTwoFactorRecoveryCodes();
  const disable = useDisableTwoFactor();
  const isPending = regenerate.isPending || disable.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const body = useRecoveryCode
      ? { password, recoveryCode: code.trim() }
      : { password, code };
    const request =
      action === 'regenerate'
        ? regenerate
            .mutateAsync(body as never)
            .then((data) => onDone(data.recoveryCodes))
        : disable.mutateAsync(body as never).then(() => onDone());

    request.catch((error) => {
      setCode('');
      showError(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Text>
        {action === 'regenerate'
          ? intl.get('two_factor.regenerate_hint')
          : intl.get('two_factor.disable_hint')}
      </Text>
      <Narrow>
        <FormGroup label={intl.get('password')}>
          <InputGroup
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            data-testId="two-factor-password-input"
          />
        </FormGroup>
        <FormGroup
          label={
            useRecoveryCode
              ? intl.get('two_factor.recovery_code')
              : intl.get('two_factor.code')
          }
        >
          <InputGroup
            value={code}
            onChange={(event) =>
              setCode(
                useRecoveryCode
                  ? event.target.value
                  : normalizeCodeInput(event.target.value),
              )
            }
            inputMode={useRecoveryCode ? 'text' : 'numeric'}
            autoComplete={useRecoveryCode ? 'off' : 'one-time-code'}
            placeholder={useRecoveryCode ? 'xxxx-xxxx-xxxx-xxxx' : '123456'}
            data-testId="two-factor-code-input"
          />
        </FormGroup>
        <Button
          minimal
          small
          onClick={() => {
            setUseRecoveryCode(!useRecoveryCode);
            setCode('');
          }}
        >
          {useRecoveryCode
            ? intl.get('two_factor.use_app_code')
            : intl.get('two_factor.use_recovery_code')}
        </Button>
      </Narrow>
      <Actions>
        <Button
          type="submit"
          intent={action === 'disable' ? Intent.DANGER : Intent.PRIMARY}
          loading={isPending}
          disabled={!password || !code}
          data-testId="two-factor-verify-submit"
        >
          {action === 'regenerate'
            ? intl.get('two_factor.regenerate_button')
            : intl.get('two_factor.disable_button')}
        </Button>
        <Button minimal onClick={onCancel}>
          {intl.get('cancel')}
        </Button>
      </Actions>
    </form>
  );
}

const Root = styled.div`
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const Text = styled.p`
  line-height: 1.55;
  margin-bottom: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const SetupGrid = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(240px, 360px);
  gap: 24px;
  align-items: start;
  margin: 12px 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Narrow = styled.div`
  max-width: 360px;
`;
