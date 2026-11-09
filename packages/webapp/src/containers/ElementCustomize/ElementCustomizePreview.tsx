import * as FF from 'fp-ts/function';
import { ElementCustomizeHeader } from './ElementCustomizeHeader';
import { ElementCustomizePreviewContent } from './ElementCustomizePreviewContent';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

function ElementCustomizePreviewRoot({ closeDrawer }: WithDrawerActionsProps) {
  const { name } = useDrawerContext();

  const handleCloseBtnClick = () => {
    closeDrawer(name);
  };
  return (
    <Stack
      spacing={0}
      style={{
        borderLeft: '1px solid var(--color-element-customize-divider)',
        height: '100vh',
        flex: '1 1',
      }}
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

export const ElementCustomizePreview = FF.pipe(
  ElementCustomizePreviewRoot,
  withDrawerActions,
);
