import { Classes } from '@blueprintjs/core';
import { EstimateCustomizeContent } from './EstimateCustomizeContent';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export function EstimateCustomizeDrawerBody() {
  const { payload } = useDrawerContext();
  const templateId = payload?.templateId || null;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <EstimateCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
