import { Button, Intent, Radio } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import { ExportResources } from './constants';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FFormGroup, FRadioGroup, FSelect, Group } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ExportDialogFormContentValues {
  resource: string;
  format: string;
}

interface ExportDialogFormContentProps extends WithDialogActionsProps {}

function ExportDialogFormContentRoot({
  closeDialog,
}: ExportDialogFormContentProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<ExportDialogFormContentValues>();
  const handleCancelBtnClick = () => {
    closeDialog(DialogsName.Export);
  };

  return (
    <Form>
      <x.div p="20px">
        <x.p className="bp4-text-muted" mb="1.2rem">
          You can export data from Bigcapital in CSV or XLSX format
        </x.p>

        <FFormGroup name={'resource'} label={'Select Resource'}>
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
