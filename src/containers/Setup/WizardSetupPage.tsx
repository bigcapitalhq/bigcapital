// @ts-nocheck
import React from 'react';
import SetupRightSection from './SetupRightSection';
import SetupLeftSection from './SetupLeftSection';

import '@/style/pages/Setup/SetupPage.scss';

export default function WizardSetupPage() {
  return (
    <div class="setup-page">
      <SetupLeftSection />
      <SetupRightSection />
    </div>
  );
};