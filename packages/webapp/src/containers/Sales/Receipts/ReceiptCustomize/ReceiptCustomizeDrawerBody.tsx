import { Classes } from '@blueprintjs/core';
import { ReceiptCustomizeContent } from './ReceiptCustomizeContent';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export function ReceiptCustomizeDrawerBody() {
  const { payload } = useDrawerContext();
  const templateId = payload.templateId;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <ReceiptCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
