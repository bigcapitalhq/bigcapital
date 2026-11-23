import { Button, Classes } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { MfaStepLinks, MfaStepText, MfaStepTitle } from './MfaStepLayout';

interface MfaUnsupportedMethodProps {
  onRestart: () => void;
  onBackToMethods?: () => void;
}

/**
 * Safety net for a method the server offers but this webapp cannot render.
 */
export function MfaUnsupportedMethod({
  onRestart,
  onBackToMethods,
}: MfaUnsupportedMethodProps) {
  return (
    <div>
      <MfaStepTitle>{intl.get('two_factor.signin_title')}</MfaStepTitle>
      <MfaStepText className={Classes.TEXT_MUTED}>
        {intl.get('mfa.unsupported_method')}
      </MfaStepText>

      <MfaStepLinks>
        <span>
          {onBackToMethods && (
            <Button minimal small onClick={onBackToMethods}>
              {intl.get('mfa.use_another_method')}
            </Button>
          )}
        </span>
        <Button minimal small onClick={onRestart}>
          {intl.get('two_factor.back_to_signin')}
        </Button>
      </MfaStepLinks>
    </div>
  );
}
