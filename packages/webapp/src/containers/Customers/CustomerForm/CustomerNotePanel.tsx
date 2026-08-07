import intl from 'react-intl-universal';
import { FFormGroup, FTextArea } from '@/components';

export function CustomerNotePanel() {
  return (
    <FFormGroup name={'note'} label={intl.get('note')} inline={false}>
      <FTextArea name={'note'} fill />
    </FFormGroup>
  );
}
