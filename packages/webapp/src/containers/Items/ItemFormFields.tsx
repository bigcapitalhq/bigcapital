import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { ItemFormBasicSection } from './ItemFormBasicSection';
import { ItemFormInventorySection } from './ItemFormInventorySection';
import { ItemFormPurchasingSection } from './ItemFormPurchasingSection';
import { ItemFormSellingSection } from './ItemFormSellingSection';
import { Box } from '@/components';

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
    </Box>
  );
}
