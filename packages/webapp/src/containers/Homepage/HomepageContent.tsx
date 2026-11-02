import React from 'react';
import { AccountsPayableSection } from './AccountsPayableSection';
import { AccountsReceivableSection } from './AccountsReceivableSection';
import { FinancialAccountingSection } from './FinancialAccountingSection';
import { ProductsServicesSection } from './ProductsServicesSection';
import { ExtensionSlot } from '@/extensions/slots/ExtensionSlot';
import { useAuthOrganizationId } from '@/hooks/state';
import '@/style/pages/HomePage/HomePage.scss';

export function HomepageContent() {
  const organizationId = useAuthOrganizationId();

  return (
    <div className="financial-reports">
      <AccountsReceivableSection />
      <AccountsPayableSection />
      <FinancialAccountingSection />
      <ProductsServicesSection />

      <ExtensionSlot name="dashboard.widgets" context={{ organizationId }} />
    </div>
  );
}
