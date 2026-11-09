import * as FF from 'fp-ts/function';
import { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const TaxRateDetailsDrawerContent = lazy(() =>
  import('./TaxRateDetailsContent').then((m) => ({
    default: m.TaxRateDetailsContent,
  })),
);

type TaxRateDetailsDrawerInnerProps = WithDrawersProps & { name: string };

/**
 * Tax rate details drawer.
 */
function TaxRateDetailsDrawerInner({
  name,
  isOpen,
  payload: { taxRateId },
}: TaxRateDetailsDrawerInnerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '650px', maxWidth: '650px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <TaxRateDetailsDrawerContent
          name={name}
          taxRateId={taxRateId as number}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const TaxRateDetailsDrawer = FF.pipe(
  TaxRateDetailsDrawerInner,
  withDrawers(),
);
