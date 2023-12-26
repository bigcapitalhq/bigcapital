// @ts-nocheck
import { Form, useFormikContext } from 'formik';
import { FFormGroup, FInputGroup, FMultiSelect } from '@/components';
import styled from 'styled-components';
import { Button, Classes, Intent } from '@blueprintjs/core';
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
            name={'from'}
            inline={true}
            fastField={true}
          >
            <FMultiSelect
              items={[]}
              name={'from'}
              placeholder=""
              popoverProps={{ minimal: true, fill: true }}
              fill={true}
            />
          </FFormGroup>

          <FFormGroup label={'To'} name={'to'} inline={true} fastField={true}>
            <FMultiSelect
              items={[]}
              name={'to'}
              placeholder=""
              popoverProps={{ minimal: true, fill: true }}
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

const HeaderBox = styled('div')`
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border: 1px solid #dddfe9;
  padding: 15px;

  .bp4-form-group {
    margin: 0;
    padding-top: 12px;
    padding-bottom: 12px;

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
  }
`;
