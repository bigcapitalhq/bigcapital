import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import intl from 'react-intl-universal';
import { ItemFormBasicSection } from './ItemFormBasicSection';
import { ItemFormInventorySection } from './ItemFormInventorySection';
import { ItemFormPurchasingSection } from './ItemFormPurchasingSection';
import { ItemFormSellingSection } from './ItemFormSellingSection';
import { Box } from '@/components';
import { CustomFieldsFormSection } from '@/components/CustomFields';

const itemFormSectionDividerClass = css`
  margin: 20px 0;
`;

export function ItemFormSections() {
  return (
    <Box>
      <ItemFormBasicSection />
      <Divider className={itemFormSectionDividerClass} />

      <ItemFormSellingSection />
      <Divider className={itemFormSectionDividerClass} />

      <ItemFormPurchasingSection />
      <Divider className={itemFormSectionDividerClass} />

      <ItemFormInventorySection />
      <Divider className={itemFormSectionDividerClass} />

      <Box data-section-id={'customFields'}>
        <CustomFieldsFormSection
          resource={'Item'}
          title={intl.get('custom_fields.form.section_title')}
        />
      </Box>
    </Box>
  );
}
