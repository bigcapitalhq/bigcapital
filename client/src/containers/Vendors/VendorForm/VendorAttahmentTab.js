import React from 'react';
import Dragzone from 'components/Dragzone';
import { FormattedMessage as T } from 'react-intl';

/**
 * Vendor Attahment Tab.
 */
function VendorAttahmentTab() {
  return (
    <div>
      <Dragzone
        initialFiles={[]}
        onDrop={null}
        onDeleteFile={[]}
        hint={<T id={'attachments_maximum'} />}
      />
    </div>
  );
}

export default VendorAttahmentTab;
