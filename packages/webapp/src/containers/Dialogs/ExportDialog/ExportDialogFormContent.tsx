// @ts-nocheck
import { FFormGroup, FRadioGroup, FSelect, Group } from '@/components';
import { Button, Intent, Radio } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import { x } from '@xstyled/emotion';
import { ExportResources } from './constants';
import { compose } from '@/utils';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

function ExportDialogFormContentRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();
  const handleCancelBtnClick = () => {
    closeDialog(DialogsName.Export);
  };

  return (
    <Form>
      <x.div p="20px">
        <x.p className="bp4-text-muted" mb="1.2rem">
          You can export data from Bigcapital in CSV or XLSX format
        </x.p>

        <FFormGroup
          name={'resource'}
          label={'Select Resource'}
        >
          <x.div maxWidth="280px">
            <FSelect
              name={'resource'}
              items={ExportResources}
              popoverProps={{ minimal: true }}
            />
          </x.div>
        </FFormGroup>

        <FRadioGroup label={'Export As'} name={'format'}>
          <Radio value={'xlsx'}>XLSX (Microsoft Excel)</Radio>
          <Radio value={'csv'}>CSV (Comma Seperated Value)</Radio>
        </FRadioGroup>

        <x.div mt="1.6rem">
          <Group position={'right'} spacing={10}>
            <Button intent={Intent.NONE} onClick={handleCancelBtnClick}>
              Cancel
            </Button>
            <Button
              type={'submit'}
              intent={Intent.PRIMARY}
              loading={isSubmitting}
            >
              Export
            </Button>
          </Group>
        </x.div>
      </x.div>
    </Form>
  );
}

export const ExportDialogFormContent = compose(withDialogActions)(
  ExportDialogFormContentRoot,
);
