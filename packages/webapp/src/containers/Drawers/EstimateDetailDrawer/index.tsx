import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const EstimateDetailDrawerContent = React.lazy(() =>
  import('./EstimateDetailDrawerContent').then((m) => ({
    default: m.EstimateDetailDrawerContent,
  })),
);

interface EstimateDetailDrawerProps extends WithDrawersProps {
  name: string;
}

function EstimateDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: EstimateDetailDrawerProps) {
  const estimateId = payload?.estimateId as number | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <EstimateDetailDrawerContent estimateId={estimateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(EstimateDetailDrawer);
