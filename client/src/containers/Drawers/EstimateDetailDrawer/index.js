import React from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const EstimateDetailDrawerContent = React.lazy(() =>
  import('./EstimateDetailDrawerContent'),
);

function EstimateDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { estimateId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <EstimateDetailDrawerContent estimate={estimateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(EstimateDetailDrawer);
