// @ts-nocheck
import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
  Drawer,
} from '@/components';

import QuickCreateItemDrawerForm from './QuickCreateItemDrawerForm';

/**
 * Quick create/edit item drawer content.
 */
export default function QuickCreateItemDrawerContent({ itemName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWER.QUICK_CREATE_ITEM}
        title={<T id={'create_a_new_item'} />}
      />
      <DrawerBody>
        <QuickCreateItemDrawerForm itemName={itemName} />
      </DrawerBody>
    </React.Fragment>
  );
}
