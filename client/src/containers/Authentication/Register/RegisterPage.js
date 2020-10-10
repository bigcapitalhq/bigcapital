import React from 'react';
import RegisterRightSection from './RegisterRightSection';
import RegisterLeftSection from './RegisterLeftSection';

function RegisterWizardPage() {
  return (
    <div class="register-page">    
      <RegisterLeftSection />
      <RegisterRightSection />
    </div>
  );
}

export default RegisterWizardPage;
