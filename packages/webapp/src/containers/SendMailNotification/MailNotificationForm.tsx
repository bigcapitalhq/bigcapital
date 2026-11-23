import { SelectOptionProps } from '@blueprintjs-formik/select';
import styled from 'styled-components';
import {
  Box,
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FRichEditor,
} from '@/components';
import { NS } from '@/constants/classes';

type MailOption = SelectOptionProps & { mail?: string };

interface MailNotificationFormProps {
  fromAddresses: MailOption[];
  toAddresses: MailOption[];
}

const commonAddressSelect = {
  placeholder: '',
  labelAccessor: 'label',
  valueAccessor: 'mail',
  tagAccessor: 'mail',
  textAccessor: 'mail',
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
            popoverProps={{ minimal: true }}
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
            popoverProps={{ minimal: true }}
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

  .${NS}-form-group {
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

  .${NS}-form-content {
    flex: 1 0;
  }

  .${NS}-label {
    min-width: 65px;
    color: #738091;
  }

  .${NS}-input {
    border-color: transparent;
    padding: 0;

    &:focus,
    &.${NS}-active {
      box-shadow: 0 0 0 0;
    }
  }

  .${NS}-input-ghost {
    margin-top: 5px;
  }
  .${NS}-tag-input-values {
    margin: 0;
  }
`;
