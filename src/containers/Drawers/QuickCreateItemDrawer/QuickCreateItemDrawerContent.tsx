import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';

import QuickCreateItemDrawerForm from './QuickCreateItemDrawerForm';

/**
 * Quick create/edit item drawer content.
 */
export default function QuickCreateItemDrawerContent({ itemName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name="quick-create-item"
        title={<T id={'create_a_new_item'} />}
      />
      <DrawerBody>
        <QuickCreateItemDrawerForm itemName={itemName} />
      </DrawerBody>
    </React.Fragment>
  );
}
