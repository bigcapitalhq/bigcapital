// @ts-nocheck
import { Form, useFormikContext } from 'formik';
import {
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FRichEditor,
  FSwitch,
  Hint,
} from '@/components';
import styled from 'styled-components';
import { Button, Classes, Intent, Position } from '@blueprintjs/core';
import { saveInvoke } from '@/utils';

interface SendMailNotificationFormProps {
  onClose?: () => void;
}

export function SendMailNotificationForm({
  onClose,
}: SendMailNotificationFormProps) {
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    saveInvoke(onClose);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <HeaderBox>
          <FFormGroup
            label={'From'}
            labelInfo={
              <Hint
                content={'asdasd asdasd asdsad'}
                position={Position.BOTTOM_LEFT}
              />
            }
            name={'from'}
            inline={true}
            fastField={true}
          >
            <FMultiSelect
              items={[
                {
                  text: 'a.bouhuolia@gmail.com',
                  value: 'a.bouhuolia@gmail.com',
                },
              ]}
              name={'from'}
              placeholder=""
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
              }}
              fill={true}
            />
          </FFormGroup>

          <FFormGroup label={'To'} name={'to'} inline={true} fastField={true}>
            <FMultiSelect
              items={[
                {
                  text: 'a.bouhuolia@gmail.com',
                  value: 'a.bouhuolia@gmail.com',
                },
              ]}
              name={'to'}
              placeholder=""
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
              }}
              fill={true}
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

        <AttachFormGroup name={'attach_invoice'} inline>
          <FSwitch name={'attach_invoice'} label={'Attach Invoice'} />
        </AttachFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={isSubmitting}
            onClick={handleClose}
            style={{ minWidth: '65px' }}
          >
            Close
          </Button>

          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            style={{ minWidth: '75px' }}
            type="submit"
          >
            Send
          </Button>
        </div>
      </div>
    </Form>
  );
}

const AttachFormGroup = styled(FFormGroup)`
  background: #f8f9fb;
  margin-top: 0.6rem;
  padding: 4px 14px;
  border-radius: 5px;
  border: 1px solid #dcdcdd;
`;

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
