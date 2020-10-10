import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';

function RegisterWizardSteps() {
  return (
    <div className={'register-wizard-steps'}>
      <div className={'wizard-container'}>
        <ul className={'wizard-wrapper'}>
          <li>
            <p className={'wizard-info'}>
              <T id={'organization_register'} />
            </p>
          </li>
          <li>
            <p className={'wizard-info'}>
              <T id={'payment_or_trial'} />
            </p>
          </li>
          <li className="complete">
            <p className={'wizard-info'}>
              <T id={'getting_started'} />
            </p>
          </li>

          <li>
            <p className={'wizard-info'}>
              <T id={'initializing'} />
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RegisterWizardSteps;
