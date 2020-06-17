import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Dragzone from 'components/Dragzone';

function CustomerAttachmentTabs() {
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

export default CustomerAttachmentTabs;
