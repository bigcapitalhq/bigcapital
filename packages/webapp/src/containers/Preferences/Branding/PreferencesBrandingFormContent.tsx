import { Button, Classes, Intent, Text } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FFormGroup, Group, Stack } from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
import { CompanyLogoUpload } from '@/containers/ElementCustomize/components/CompanyLogoUpload';
import { PreferencesBrandingFormValues } from './_types';
import styles from './PreferencesBranding.module.scss';

export function PreferencesBrandingFormContent() {
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
        helperText={
          'Note: These preferences will be applied across PDF and mail templates, including the customer payment page.'
        }
      >
        <FColorInput name={'primaryColor'} />
      </FFormGroup>
    </Stack>
  );
}

export function PreferencesBrandingFormFooter() {
  const { isSubmitting } = useFormikContext();

  return (
    <Group style={{ padding: '12px 0', borderTop: '1px solid #e1e1e1' }}>
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
      onChange={(file) => {
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
