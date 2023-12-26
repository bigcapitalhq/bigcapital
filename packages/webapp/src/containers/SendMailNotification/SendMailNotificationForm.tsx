// @ts-nocheck
import { Form } from 'formik';
import { FFormGroup, FInputGroup, FMultiSelect } from '@/components';

export function SendMailNotificationForm() {
  return (
    <Form>
      <FFormGroup label={'From'} name={'from'} inline={true} fastField={true}>
        <FMultiSelect
          items={[]}
          name={'from'}
          placeholder=""
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>

      <FFormGroup label={'To'} name={'to'} inline={true} fastField={true}>
        <FMultiSelect
          items={[]}
          name={'to'}
          placeholder=""
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>

      <FFormGroup
        label={'Subject'}
        name={'subject'}
        inline={true}
        fastField={true}
      >
        <FInputGroup name={'subject'} />
      </FFormGroup>
    </Form>
  );
}
