import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import { InvoiceSendMailContent } from './InvoiceSendMailContent';
import withDrawers from '@/containers/Drawer/withDrawers';

interface InvoiceSendMailDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: any;
}

function InvoiceSendMailDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: InvoiceSendMailDrawerProps) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'100%'} payload={payload}>
      <DrawerSuspense>
        <InvoiceSendMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const InvoiceSendMailDrawer = R.compose(withDrawers())(
  InvoiceSendMailDrawerRoot,
);
