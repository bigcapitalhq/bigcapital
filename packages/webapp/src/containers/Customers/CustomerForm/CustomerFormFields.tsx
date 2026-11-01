import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { CustomerBillingAddress } from './CustomerBillingAddress';
import { CustomerFormBasicSection } from './CustomerFormBasicSection';
import { CustomerFormFinancialSection } from './CustomerFormFinancialSection';
import { CustomerFormNotesSection } from './CustomerFormNotesSection';
import { CustomerShippingAddress } from './CustomerShippingAddress';
import { Box } from '@/components';

const customerFormSectionDividerClass = css`
  margin: 20px 0;
`;

export function CustomerFormSections() {
  return (
    <Box>
      <CustomerFormBasicSection />
      <Divider className={customerFormSectionDividerClass} />

      <CustomerFormFinancialSection />
      <Divider className={customerFormSectionDividerClass} />

      <CustomerBillingAddress />
      <Divider className={customerFormSectionDividerClass} />

      <CustomerShippingAddress />
      <Divider className={customerFormSectionDividerClass} />

      <CustomerFormNotesSection />
    </Box>
  );
}
