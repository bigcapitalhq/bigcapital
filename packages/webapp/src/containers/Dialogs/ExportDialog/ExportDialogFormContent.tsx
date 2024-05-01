import { FFormGroup, FRadioGroup, FSelect } from '@/components';
import { Button, Callout, Intent, Radio } from '@blueprintjs/core';
import { Form } from 'formik';
import { ExportResources } from './constants';

export function ExportDialogFormContent() {
  return (
    <Form>
      <Callout>
        You can export data from Bigcapital in CSV or XLSX format
      </Callout>

      <FFormGroup name={'resource'} label={'Select Resource'}>
        <FSelect name={'resource'} items={ExportResources} />
      </FFormGroup>

      <FRadioGroup label={'Export As'} name={'format'}>
        <Radio value={'xlsx'}>XLSX (Microsoft Excel)</Radio>
        <Radio value={'csv'}>CSV (Comma Seperated Value)</Radio>
      </FRadioGroup>

      <div>
        <Button type={'submit'} intent={Intent.PRIMARY}>
          Export
        </Button>
      </div>
    </Form>
  );
}
