import { Box, Group } from '@/components';
import { InvoiceCustomizePreview } from './InvoiceCustomizePreview';
import { InvoiceCustomizeFields } from './InvoiceCustomizeFields';
import { InvoiceCustomizeForm } from './InvoiceCustomizerForm';
import { Classes } from '@blueprintjs/core';
import { InvoiceCustomizeTabsControllerProvider } from './InvoiceCustomizeTabsController';

export default function InvoiceCustomizeContent() {
  return (
    <Box className={Classes.DRAWER_BODY}>
      <InvoiceCustomizeForm>
        <Group spacing={0} align="flex-start">
          <InvoiceCustomizeTabsControllerProvider>
            <InvoiceCustomizeFields />
            <InvoiceCustomizePreview />
          </InvoiceCustomizeTabsControllerProvider>
        </Group>
      </InvoiceCustomizeForm>
    </Box>
  );
}
