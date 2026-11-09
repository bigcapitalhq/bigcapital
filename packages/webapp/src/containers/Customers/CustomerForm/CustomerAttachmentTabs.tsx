import { Dragzone, FormattedMessage as T } from '@/components';

export function CustomerAttachmentTabs() {
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
