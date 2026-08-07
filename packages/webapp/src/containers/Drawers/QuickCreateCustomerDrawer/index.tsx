import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const QuickCreateCustomerDrawerContent = lazy(() =>
  import('./QuickCreateCustomerDrawerContent').then((m) => ({
    default: m.QuickCreateCustomerDrawerContent,
  })),
);

interface QuickCreateCustomerDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { autofillRef?: number; displayName?: string };
}

/**
 * Quick Create customer
 */
function QuickCreateCustomerDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { autofillRef, displayName },
}: QuickCreateCustomerDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'80%'}
    >
      <DrawerSuspense>
        <QuickCreateCustomerDrawerContent
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(QuickCreateCustomerDrawer);
