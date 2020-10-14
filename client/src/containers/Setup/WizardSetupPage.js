import React from 'react';
import SetupRightSection from './SetupRightSection';
import SetupLeftSection from './SetupLeftSection';


export default function WizardSetupPage() {
  return (
    <div class="setup-page">
      <SetupLeftSection />
      <SetupRightSection />
    </div>
  );
};