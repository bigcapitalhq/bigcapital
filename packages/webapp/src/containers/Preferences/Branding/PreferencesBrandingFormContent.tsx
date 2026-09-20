import { Button, Classes, Intent, Text } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import styles from './PreferencesBranding.module.scss';
import type { PreferencesBrandingFormValues } from './_types';
import { FFormGroup, Group, Stack } from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
import { CompanyLogoUpload } from '@/containers/ElementCustomize/components/CompanyLogoUpload';
import { useIsDarkMode } from '@/hooks/useDarkMode';

const PRIMARY_COLOR_HELPER_TEXT =
  'Note: These preferences will be applied across PDF and mail templates, including the customer payment page.';

export function PreferencesBrandingFormContent() {
  const { errors, touched } = useFormikContext<PreferencesBrandingFormValues>();

  // The form group renders the validation message as its helper text, so
  // passing a helper text of our own would hide it and leave a failed submit
  // without any reason shown.
  const primaryColorError = touched.primaryColor ? errors.primaryColor : null;

  return (
    <Stack style={{ flex: '1' }} spacing={10}>
      <FFormGroup name={'companyLogo'} label={'Company Logo'}>
        <Group spacing={15} align={'left'}>
          <BrandingCompanyLogoUpload />
          <BrandingCompanyLogoDesc />
        </Group>
      </FFormGroup>

      <FFormGroup
        name={'primaryColor'}
        label={'Primary Color'}
        helperText={primaryColorError || PRIMARY_COLOR_HELPER_TEXT}
      >
        <FColorInput name={'primaryColor'} />
      </FFormGroup>
    </Stack>
  );
}

export function PreferencesBrandingFormFooter() {
  const { isSubmitting } = useFormikContext<PreferencesBrandingFormValues>();
  const isDarkMode = useIsDarkMode();

  return (
    <Group
      style={{
        padding: '12px 0',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.25)' : '#e1e1e1'}`,
      }}
    >
      <Button intent={Intent.PRIMARY} type={'submit'} loading={isSubmitting}>
        Submit
      </Button>
    </Group>
  );
}

export function BrandingCompanyLogoUpload() {
  const { setFieldValue, values } =
    useFormikContext<PreferencesBrandingFormValues>();

  return (
    <CompanyLogoUpload
      initialPreview={values?.logoUri}
      onChange={(file: File | null) => {
        const imageUrl = file ? URL.createObjectURL(file) : '';

        setFieldValue('_logoFile', file);
        setFieldValue('logoUri', imageUrl);
        setFieldValue('logoKey', '');
      }}
      classNames={{
        root: styles.fileUploadRoot,
      }}
    />
  );
}

function BrandingCompanyLogoDesc() {
  return (
    <Stack spacing={10} style={{ fontSize: 12, paddingTop: 12, flex: 1 }}>
      <Text className={Classes.TEXT_MUTED}>
        This logo will be displayed in transaction PDFs and email notifications.
      </Text>
      <Text className={Classes.TEXT_MUTED}>
        Preferred Image Dimensions: 240 × 240 pixels @ 72 DPI Maximum File Size:
        1MB
      </Text>
    </Stack>
  );
}
