import React from 'react';
import AccountsReceivableSection from './AccountsReceivableSection';
import AccountsPayableSection from './AccountsPayableSection';
import FinancialAccountingSection from './FinancialAccountingSection';
import ProductsServicesSection from './ProductsServicesSection';
import 'style/pages/HomePage/HomePage.scss';

function HomepageContent() {
  return (
    <div>
      <AccountsReceivableSection />
      <AccountsPayableSection />
      <FinancialAccountingSection />
      <ProductsServicesSection />
    </div>
  );
}

export default HomepageContent;
