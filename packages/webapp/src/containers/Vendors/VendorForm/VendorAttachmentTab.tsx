import { Dragzone, FormattedMessage as T } from '@/components';

/**
 * Vendor Attachment Tab.
 */
export function VendorAttachmentTab() {
  return (
    <div>
      <Dragzone
        className={''}
        initialFiles={[]}
        onDrop={null}
        onDeleteFile={[]}
        hint={<T id={'attachments_maximum'} />}
      />
    </div>
  );
}
