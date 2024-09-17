// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { InvoiceCustomizeContent } from './InvoiceCustomizeContent';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';
import { Box } from '@/components';

export default function InvoiceCustomize() {
  const { payload } = useDrawerContext();
  const templateId = payload.templateId;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <InvoiceCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
