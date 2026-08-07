// @ts-nocheck
import { useFormikContext } from 'formik';
import { CompanyLogoUpload } from './CompanyLogoUpload';
import { FFormGroup } from '@/components';

export function BrandingCompanyLogoUploadField() {
  const { setFieldValue, values } = useFormikContext();

  return (
    <FFormGroup name={'companyLogo'} label={''} fastField>
      <CompanyLogoUpload
        initialPreview={values.companyLogoUri}
        onChange={(file) => {
          const imageUrl = file ? URL.createObjectURL(file) : '';

          // Reset the logo key since it is changed.
          setFieldValue('companyLogoKey', '');

          setFieldValue('_companyLogoFile', file);
          setFieldValue('companyLogoUri', imageUrl);
        }}
      />
    </FFormGroup>
  );
}
