// @ts-nocheck
import React from 'react';
import { Dragzone, FormattedMessage as T } from '@/components';

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
