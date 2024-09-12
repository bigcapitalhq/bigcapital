import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { PaymentReceivedCustomizeContent } from './PaymentReceivedCustomizeContent';
import { BrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export default function PaymentReceivedCustomize() {
  const { payload } = useDrawerContext();
  const templateId = payload.templateId;

  return (
    <Box className={Classes.DRAWER_BODY}>
      <BrandingTemplateBoot templateId={templateId}>
        <PaymentReceivedCustomizeContent />
      </BrandingTemplateBoot>
    </Box>
  );
}
