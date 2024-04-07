import React from 'react';
import SetupRightSection from './SetupRightSection';
import SetupLeftSection from './SetupLeftSection';

import '@/style/pages/Setup/SetupPage.scss';

export default function WizardSetupPage() {
  return (
    <div className="setup-page">
      <SetupLeftSection />
      <SetupRightSection />
    </div>
  );
}
