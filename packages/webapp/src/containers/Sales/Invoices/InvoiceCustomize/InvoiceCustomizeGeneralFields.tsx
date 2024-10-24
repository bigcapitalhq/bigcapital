// @ts-nocheck
import { Classes, Text } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import {
  FFormGroup,
  FieldRequiredHint,
  FInputGroup,
  FSwitch,
  Group,
  Stack,
} from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
import { CreditCardIcon } from '@/icons/CreditCardIcon';
import { Overlay } from './Overlay';
import { useIsTemplateNamedFilled } from '@/containers/BrandingTemplates/utils';
import { BrandingCompanyLogoUploadField } from '@/containers/ElementCustomize/components/BrandingCompanyLogoUploadField';
import { MANAGE_LINK_URL } from './constants';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';

export function InvoiceCustomizeGeneralField() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack spacing={0}>
        <h2 style={{ fontSize: 16, marginBottom: 10, fontWeight: 600 }}>
          General Branding
        </h2>
        <p className={Classes.TEXT_MUTED}>
          Set your company logo and branding colors to be automatically applied to your invoices.
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

        <InvoiceCustomizePaymentManage />
      </Overlay>
    </Stack>
  );
}

function InvoiceCustomizePaymentManage() {
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const handleLinkClick = () => {
    closeDrawer(name);
  };

  return (
    <Group
      style={{
        backgroundColor: '#FBFBFB',
        border: '1px solid #E1E1E1',
        padding: 10,
        borderRadius: 5,
      }}
      position={'apart'}
    >
      <Group spacing={10}>
        <CreditCardIcon fill={'#7D8897'} height={16} width={16} />
        <Text>Accept payment methods</Text>
      </Group>

      <Link
        style={{ fontSize: 13 }}
        to={MANAGE_LINK_URL}
        onClick={handleLinkClick}
      >
        Manage
      </Link>
    </Group>
  );
}
