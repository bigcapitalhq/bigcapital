import React from 'react';

import EnsureOrganizationIsNotReady from './EnsureOrganizationIsNotReady';
import SetupRightSection from './SetupRightSection';
import SetupLeftSection from './SetupLeftSection';


export default function WizardSetupPage() {
  return (
    <EnsureOrganizationIsNotReady>
      <div class="setup-page">
        <SetupLeftSection />
        <SetupRightSection />
      </div>
    </EnsureOrganizationIsNotReady>
  );
};