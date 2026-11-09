import intl from 'react-intl-universal';
import { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import {
  Box,
  FFormGroup,
  FormattedMessage as T,
  FTextArea,
} from '@/components';

export function CustomerFormNotesSection() {
  return (
    <Box data-section-id="notes">
      <CustomerFormSectionTitle>
        <T id={'notes'} />
      </CustomerFormSectionTitle>

      <FFormGroup name={'note'} label={intl.get('note')} inline>
        <FTextArea name={'note'} fill />
      </FFormGroup>
    </Box>
  );
}
