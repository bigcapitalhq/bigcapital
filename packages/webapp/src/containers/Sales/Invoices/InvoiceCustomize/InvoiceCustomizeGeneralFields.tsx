// @ts-nocheck
import { FFormGroup, FSwitch, Stack } from '@/components';
import { FColorInput } from './FColorField';
import styles from './InvoiceCustomizeFields.module.scss';
import { Classes } from '@blueprintjs/core';

export function InvoiceCustomizeGeneralField() {
  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack spacing={0}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>General Branding</h2>
        <p className={Classes.TEXT_MUTED}>
          Set your invoice details to be automatically applied every time you
          create a new invoice.
        </p>
      </Stack>

      <Stack spacing={0}>
        <FFormGroup
          name={'primaryColor'}
          label={'Primary Color'}
          inline
          className={styles.fieldGroup}
        >
          <FColorInput
            name={'primaryColor'}
            inputProps={{ style: { maxWidth: 120 } }}
          />
        </FFormGroup>

        <FFormGroup
          name={'secondaryColor'}
          label={'Secondary Color'}
          inline
          className={styles.fieldGroup}
        >
          <FColorInput
            name={'secondaryColor'}
            inputProps={{ style: { maxWidth: 120 } }}
          />
        </FFormGroup>

        <FFormGroup name={'showLogo'} label={'Logo'}>
          <FSwitch
            name={'showLogo'}
            label={'Display company logo in the paper'}
            className={styles.showCompanyLogoField}
            large
          />
        </FFormGroup>
      </Stack>
    </Stack>
  );
}
