// @ts-nocheck
import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import QuickCreateItemDrawerForm from './QuickCreateItemDrawerForm';

/**
 * Quick create/edit item drawer content.
 */
export default function QuickCreateItemDrawerContent({ itemName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWERS.QUICK_CREATE_ITEM}
        title={<T id={'create_a_new_item'} />}
      />
      <DrawerBody>
        <QuickCreateItemDrawerForm itemName={itemName} />
      </DrawerBody>
    </React.Fragment>
  );
}
