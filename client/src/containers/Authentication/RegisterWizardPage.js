import React from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import RegisterLeftSidebar from './RegisterLeftSidebar';

function RegisterWizardPage() {
  return (
    <>
      <Switch>
        <div>
          <RegisterLeftSidebar />
        </div>
      </Switch>
    </>
  );
}

export default RegisterWizardPage;
