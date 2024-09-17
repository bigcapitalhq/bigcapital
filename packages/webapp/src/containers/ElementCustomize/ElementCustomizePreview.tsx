// @ts-nocheck
import * as R from 'ramda';
import { Stack } from '@/components';
import { ElementCustomizeHeader } from './ElementCustomizeHeader';
import { ElementCustomizePreviewContent } from './ElementCustomizePreviewContent';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

function ElementCustomizePreviewRoot({ closeDrawer }) {
  const { name } = useDrawerContext();

  const handleCloseBtnClick = () => {
    closeDrawer(name);
  };
  return (
    <Stack
      spacing={0}
      style={{ borderLeft: '1px solid #D9D9D9', height: '100vh', flex: '1 1' }}
    >
      <ElementCustomizeHeader
        label={'Preview'}
        closeButton
        onClose={handleCloseBtnClick}
      />
      <ElementCustomizePreviewContent />
    </Stack>
  );
}

export const ElementCustomizePreview = R.compose(withDrawerActions)(
  ElementCustomizePreviewRoot,
);
