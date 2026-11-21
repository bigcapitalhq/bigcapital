import { Divider } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { ItemFormBasicSection } from './ItemFormBasicSection';
import { ItemFormInventorySection } from './ItemFormInventorySection';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormPurchasingSection } from './ItemFormPurchasingSection';
import { ItemFormSellingSection } from './ItemFormSellingSection';
import { ItemImagesSection } from './ItemImagesSection';
import { Box } from '@/components';

const itemFormSectionDividerClass = css`
  margin: 20px 0;
`;

export function ItemFormSections() {
  const { itemImagesEnabled } = useItemFormContext();

  return (
    <Box>
      <ItemFormBasicSection />
      <Divider className={itemFormSectionDividerClass} />

      {itemImagesEnabled ? (
        <>
          <ItemImagesSection />
          <Divider className={itemFormSectionDividerClass} />
        </>
      ) : null}

      <ItemFormSellingSection />
      <Divider className={itemFormSectionDividerClass} />

      <ItemFormPurchasingSection />
      <Divider className={itemFormSectionDividerClass} />

      <ItemFormInventorySection />
    </Box>
  );
}
