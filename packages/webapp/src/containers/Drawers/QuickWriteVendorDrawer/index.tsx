import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const QuickWriteVendorDrawerContent = lazy(() =>
  import('./QuickWriteVendorDrawerContent').then((m) => ({
    default: m.QuickWriteVendorDrawerContent,
  })),
);

interface QuickWriteVendorDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { displayName?: string; autofillRef?: number };
}

/**
 * Quick Write vendor.
 */
function QuickWriteVendorDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { displayName, autofillRef },
}: QuickWriteVendorDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'80%'}
    >
      <DrawerSuspense>
        <QuickWriteVendorDrawerContent
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(QuickWriteVendorDrawer);
