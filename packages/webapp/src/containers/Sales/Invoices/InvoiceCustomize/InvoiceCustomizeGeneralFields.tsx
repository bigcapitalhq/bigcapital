import { Box, FFormGroup, FSwitch, Stack } from '@/components';
import { FColorInput } from './FColorField';
import styles from './InvoiceCustomizeFields.module.scss';
import { Classes } from '@blueprintjs/core';

export function InvoiceCustomizeGeneralField() {
  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack>
        <h2>General Branding</h2>
        <p className={Classes.TEXT_MUTED}>
          Set your invoice details to be automatically applied every time you
          create a new invoice.
        </p>
      </Stack>

      <FFormGroup
        name={'primaryColor'}
        label={'Primary Color'}
        inline
        className={styles.fieldGroup}
      >
        <FColorInput name={'primaryColor'} />
      </FFormGroup>

      <FFormGroup
        name={'secondaryColor'}
        label={'Secondary Color'}
        inline
        className={styles.fieldGroup}
      >
        <FColorInput name={'secondaryColor'} />
      </FFormGroup>

      <FFormGroup name={'showLogo'} label={'Logo'}>
        <FSwitch
          name={'showLogo'}
          label={'Display company logo in the paper'}
          large
        />
      </FFormGroup>
    </Stack>
  );
}
