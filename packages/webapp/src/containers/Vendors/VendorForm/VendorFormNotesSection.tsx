import intl from 'react-intl-universal';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import {
  Box,
  FFormGroup,
  FormattedMessage as T,
  FTextArea,
} from '@/components';

export function VendorFormNotesSection() {
  return (
    <Box data-section-id="notes">
      <VendorFormSectionTitle>
        <T id={'notes'} />
      </VendorFormSectionTitle>

      <FFormGroup name={'note'} label={intl.get('note')} inline fastField>
        <FTextArea name={'note'} fill fastField />
      </FFormGroup>
    </Box>
  );
}
