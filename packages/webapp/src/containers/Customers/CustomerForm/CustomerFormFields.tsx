import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import intl from 'react-intl-universal';
import { CustomerBillingAddress } from './CustomerBillingAddress';
import { CustomerFormBasicSection } from './CustomerFormBasicSection';
import { CustomerFormFinancialSection } from './CustomerFormFinancialSection';
import { CustomerFormNotesSection } from './CustomerFormNotesSection';
import { CustomerShippingAddress } from './CustomerShippingAddress';
import { Box } from '@/components';
import { CustomFieldsFormSection } from '@/components/CustomFields';

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
      <CustomerCustomFieldsSection />
    </Box>
  );
}

function CustomerCustomFieldsSection() {
  return (
    <Box data-section-id={'customFields'}>
      <CustomFieldsFormSection
        resource={'Customer'}
        title={intl.get('custom_fields.form.section_title')}
      />
    </Box>
  );
}
