// @ts-nocheck
import {
  Box,
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FRichEditor,
} from '@/components';
import styled from 'styled-components';
import { SelectOptionProps } from '@blueprintjs-formik/select';

interface MailNotificationFormProps {
  fromAddresses: SelectOptionProps[];
  toAddresses: SelectOptionProps[];
}

const commonAddressSelect = {
  placeholder: '',
  labelAccessor: '',
  valueAccessor: 'mail',
  tagAccessor: (item) => `<${item.label}> (${item.mail})`,
  textAccessor: (item) => `<${item.label}> (${item.mail})`,
};

export function MailNotificationForm({
  fromAddresses,
  toAddresses,
}: MailNotificationFormProps) {
  return (
    <Box>
      <HeaderBox>
        <FFormGroup label={'From'} name={'from'} inline={true} fastField={true}>
          <FMultiSelect
            items={fromAddresses}
            name={'from'}
            popoverProps={{ minimal: true, fill: true }}
            tagInputProps={{
              tagProps: { round: true, minimal: true, large: true },
            }}
            fill={true}
            {...commonAddressSelect}
          />
        </FFormGroup>

        <FFormGroup label={'To'} name={'to'} inline={true} fastField={true}>
          <FMultiSelect
            items={toAddresses}
            name={'to'}
            placeholder=""
            popoverProps={{ minimal: true, fill: true }}
            tagInputProps={{
              tagProps: { round: true, minimal: true, large: true },
            }}
            fill={true}
            {...commonAddressSelect}
          />
        </FFormGroup>

        <FFormGroup
          label={'Subject'}
          name={'subject'}
          inline={true}
          fastField={true}
        >
          <FInputGroup name={'subject'} fill={true} />
        </FFormGroup>
      </HeaderBox>

      <MailMessageEditor name={'message'} />
    </Box>
  );
}

const MailMessageEditor = styled(FRichEditor)`
  padding: 15px;
  border: 1px solid #dedfe9;
  border-top: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const HeaderBox = styled('div')`
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border: 1px solid #dddfe9;
  border-bottom: 2px solid #eaeaef;
  padding: 6px 15px;

  .bp4-form-group {
    margin: 0;
    padding-top: 8px;
    padding-bottom: 8px;

    &:not(:last-of-type) {
      border-bottom: 1px solid #dddfe9;
    }
    &:first-of-type {
      padding-top: 0;
    }
    &:last-of-type {
      padding-bottom: 0;
    }
  }

  .bp4-form-content {
    flex: 1 0;
  }

  .bp4-label {
    min-width: 65px;
    color: #738091;
  }

  .bp4-input {
    border-color: transparent;
    padding: 0;

    &:focus,
    &.bp4-active {
      box-shadow: 0 0 0 0;
    }
  }

  .bp4-input-ghost {
    margin-top: 5px;
  }
  .bp4-tag-input-values {
    margin: 0;
  }
`;
