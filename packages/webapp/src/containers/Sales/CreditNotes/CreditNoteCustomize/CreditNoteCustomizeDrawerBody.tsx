import { Classes } from '@blueprintjs/core';
import { CreditNoteCustomizeContent } from './CreditNoteCustomizeContent';
import { Box } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export function CreditNoteCustomizeDrawerBody() {
  const { payload } = useDrawerContext();
  const templateId = payload?.templateId || null;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <CreditNoteCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
