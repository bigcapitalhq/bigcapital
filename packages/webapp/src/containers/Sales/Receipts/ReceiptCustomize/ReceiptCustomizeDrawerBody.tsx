import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { ReceiptCustomizeContent } from './ReceiptCustomizeContent';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

export default function ReceiptCustomizeDrawerBody() {
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
