import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegisterWizardSteps from './RegisterWizardSteps';
import registerRoutes from 'routes/register';

export default function RegisterRightSection () {

  return (
    <section className={'register-page__right-section'}>
      <RegisterWizardSteps />

      <div class="register-page-form">
        <Switch>
          { registerRoutes.map((route, index) => (
            <Route
              exact={route.exact}
              key={index}
              path={`${route.path}`}
              component={route.component}
            />
          )) }
        </Switch>
      </div>
    </section>
  )
}