import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Wizard, Steps, Step } from 'react-albus';
import { useHistory } from "react-router-dom";
import RegisterWizardSteps from './RegisterWizardSteps';
import PrivateRoute from 'components/PrivateRoute';

import RegisterUserForm from 'containers/Authentication/Register/RegisterUserForm';
import RegisterSubscriptionForm from 'containers/Authentication/Register/RegisterSubscriptionForm';
import RegisterOrganizationForm from 'containers/Authentication/Register/RegisterOrganizationForm';

export default function RegisterRightSection () {
  const history = useHistory();

  return (
    <section className={'register-page__right-section'}>
      <Wizard
        basename={'/register'}
        history={history}
        render={({ step, steps }) => (
          <div>
            <RegisterWizardSteps currentStep={steps.indexOf(step) + 1} />

            <TransitionGroup>
              <CSSTransition
                key={step.id}
                classNames="example"
                timeout={{ enter: 500, exit: 500 }}
              >
                <div class="register-page-form">
                  <Steps key={step.id} step={step}>
                    <Step id="user">
                      <RegisterUserForm />
                    </Step>

                    <Step id="subscription">
                      <PrivateRoute component={RegisterSubscriptionForm} />
                    </Step>

                    <Step id="organization">
                      <PrivateRoute component={RegisterOrganizationForm} />
                    </Step>

                    <Step id="congratulations">
                      <h1 className="text-align-center">Ice King</h1>
                    </Step>
                  </Steps>
                </div>
              </CSSTransition>
            </TransitionGroup>
        </div>
      )} />
    </section>
  )
}