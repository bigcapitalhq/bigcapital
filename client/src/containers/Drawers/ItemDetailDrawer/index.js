import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const ItemDetailDrawerContent = React.lazy(() =>
  import('./ItemDetailDrawerContent'),
);

/**
 * Item Detail drawer.
 */
function ItemDetailDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { itemId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <ItemDetailDrawerContent item={itemId} />
      </DrawerSuspense>
    </Drawer>
  );
}
export default compose(withDrawers())(ItemDetailDrawer);
