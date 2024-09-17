import { Box } from '@/components';
import { CreditNoteCustomizeContent } from './CreditNoteCustomizeContent';
import { Classes } from '@blueprintjs/core';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

export default function CreditNoteCustomizeDrawerBody() {
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
