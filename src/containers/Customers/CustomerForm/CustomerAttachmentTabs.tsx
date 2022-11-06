// @ts-nocheck
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Dragzone, FormattedMessage as T } from '@/components';

function CustomerAttachmentTabs() {
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

export default CustomerAttachmentTabs;
