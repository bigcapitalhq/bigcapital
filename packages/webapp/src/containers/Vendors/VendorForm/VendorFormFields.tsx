import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import intl from 'react-intl-universal';
import { VendorBillingAddress } from './VendorBillingAddress';
import { VendorFormBasicSection } from './VendorFormBasicSection';
import { VendorFormFinancialSection } from './VendorFormFinancialSection';
import { VendorFormNotesSection } from './VendorFormNotesSection';
import { VendorShippingAddress } from './VendorShippingAddress';
import { Box } from '@/components';
import { CustomFieldsFormSection } from '@/components/CustomFields';

const vendorFormSectionDividerClass = css`
  margin: 20px 0;
`;

export function VendorFormSections() {
  return (
    <Box>
      <VendorFormBasicSection />
      <Divider className={vendorFormSectionDividerClass} />

      <VendorFormFinancialSection />
      <Divider className={vendorFormSectionDividerClass} />

      <VendorBillingAddress />
      <Divider className={vendorFormSectionDividerClass} />

      <VendorShippingAddress />
      <Divider className={vendorFormSectionDividerClass} />

      <VendorFormNotesSection />
      <VendorCustomFieldsSection />
    </Box>
  );
}

function VendorCustomFieldsSection() {
  return (
    <Box data-section-id={'customFields'}>
      <CustomFieldsFormSection
        resource={'Vendor'}
        title={intl.get('custom_fields.form.section_title')}
      />
    </Box>
  );
}
