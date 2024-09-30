// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  FSwitch,
  FieldRequiredHint,
  Stack,
} from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { Overlay } from '../../Invoices/InvoiceCustomize/Overlay';
import { BrandingCompanyLogoUploadField } from '@/containers/ElementCustomize/components/BrandingCompanyLogoUploadField';

export function EstimateCustomizeGeneralField() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack spacing={0}>
        <h2 style={{ fontSize: 16, marginBottom: 10, fontWeight: 600 }}>
          General Branding
        </h2>
        <p className={Classes.TEXT_MUTED}>
          Set your company logo and branding colors to be automatically applied
          to your estimates.
        </p>
      </Stack>

      <FFormGroup
        name={'templateName'}
        label={'Template Name'}
        labelInfo={<FieldRequiredHint />}
        fastField
        style={{ marginBottom: 10 }}
      >
        <FInputGroup name={'templateName'} fastField />
      </FFormGroup>

      <Overlay visible={!isTemplateNameFilled}>
        <Stack spacing={0}>
          <FFormGroup
            name={'primaryColor'} 
            label={'Primary Color'}
            style={{ justifyContent: 'space-between' }}
            inline
            fastField
          >
            <FColorInput
              name={'primaryColor'}
              inputProps={{ style: { maxWidth: 120 } }}
              fastField
            />
          </FFormGroup>

          <FFormGroup
            name={'secondaryColor'}
            label={'Secondary Color'}
            style={{ justifyContent: 'space-between' }}
            inline
            fastField
          >
            <FColorInput
              name={'secondaryColor'}
              inputProps={{ style: { maxWidth: 120 } }}
              fastField
            />
          </FFormGroup>

          <Stack spacing={10}>
            <FFormGroup
              name={'showCompanyLogo'}
              label={'Logo'}
              fastField
              style={{ marginBottom: 0 }}
            >
              <FSwitch
                name={'showCompanyLogo'}
                label={'Display company logo in the paper'}
                style={{ fontSize: 14 }}
                fastField
              />
            </FFormGroup>

            <BrandingCompanyLogoUploadField />
          </Stack>
        </Stack>
      </Overlay>
    </Stack>
  );
}
