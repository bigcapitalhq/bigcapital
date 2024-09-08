// @ts-nocheck
import * as R from 'ramda';
import { Stack } from '@/components';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import { InvoiceCustomizePreviewContent } from './InvoiceCustomizePreviewContent';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

function InvoiceCustomizePreviewRoot({ closeDrawer }) {
  const { name } = useDrawerContext();

  const handleCloseBtnClick = () => {
    closeDrawer(name);
  };
  return (
    <Stack spacing={0} style={{ borderLeft: '1px solid #D9D9D9', height: '100vh' }}>
      <InvoiceCustomizeHeader
        label={'Preview'}
        closeButton
        onClose={handleCloseBtnClick}
      />
      <InvoiceCustomizePreviewContent />
    </Stack>
  );
}

export const InvoiceCustomizePreview = R.compose(withDrawerActions)(
  InvoiceCustomizePreviewRoot,
);
