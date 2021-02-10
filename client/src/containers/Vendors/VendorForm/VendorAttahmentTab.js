import React from 'react';
import Dragzone from 'components/Dragzone';

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
        hint={'Attachments: Maxiumum size: 20MB'}
      />
    </div>
  );
}

export default VendorAttahmentTab;
