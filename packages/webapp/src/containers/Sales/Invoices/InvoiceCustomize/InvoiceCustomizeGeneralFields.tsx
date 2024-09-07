import { Box, FFormGroup } from '@/components';
import { FColorField } from './FColorField';

export function InvoiceCustomizeGeneralField() {
  return (
    <Box>
      <FFormGroup name={'primaryColor'} label={'Primary Color'} inline>
        <FColorField name={'primaryColor'} />
      </FFormGroup>

      <FFormGroup name={'secondaryColor'} label={'Secondary Color'} inline>
        <FColorField name={'secondaryColor'} />
      </FFormGroup>
    </Box>
  );
}
