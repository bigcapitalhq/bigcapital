import React from 'react';
import { QuickCreateItemDrawerForm } from './QuickCreateItemDrawerForm';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';

interface QuickCreateItemDrawerContentProps {
  itemName?: string;
}

export function QuickCreateItemDrawerContent({
  itemName,
}: QuickCreateItemDrawerContentProps): React.ReactElement {
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
