import React, { useState } from 'react';
import Icon from 'components/Icon';
import { FormattedMessage as T, useIntl } from 'react-intl';
import RegisterWizardSteps from './RegisterWizardSteps';
import RegisterOrganizationForm from './RegisterOrganizationForm';
import Register from './Register';
import Login from './Login';
import RegisterSubscriptionForm from './RegisterSubscriptionForm';

function RegisterLeftSidebar() {
  const { formatMessage } = useIntl();
  const [org] = useState('LibyanSpider');

  console.log(org, 'EE');
  return (
    <div>
      <section>
        <div className={'wizard-left-side'}>
          <div className={'content'}>
            <div className={'content-logo'}>
              <Icon
                icon={'bigcapital'}
                width={165}
                height={28}
                className="bigcapital--alt"
              />
            </div>
            <h1 className={'content-title'}>
              <T id={'register_a_new_organization_now'} />
            </h1>

            <p className={'content-text'}>
              <T id={'you_have_a_bigcapital_account'} />
            </p>
            <div className={'content-org'}>
              <span>
                <T id={'welcome'} />
                {org},
              </span>
              <span>
                <a href={'#!'}>
                  <T id={'sign_out'} />
                </a>
              </span>
            </div>

            <div className={'content-contact'}>
              <a href={'#!'}>
                <p>
                  <T id={'we_re_here_to_help'} /> {'+21892-791-8381'}
                </p>
              </a>
              <a href={'#!'}>
                <p>
                  <T id={'contact_us_technical_support'} />
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={'wizard-right-side'}>
          <RegisterWizardSteps />
          {/* <RegisterOrganizationForm /> */}
          {/* <Register /> */}
          {/* <Login/> */}
          <RegisterSubscriptionForm />
        </div>
      </section>
    </div>
  );
}

export default RegisterLeftSidebar;
