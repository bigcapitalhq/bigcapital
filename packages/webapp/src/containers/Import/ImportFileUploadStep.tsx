// @ts-nocheck
import clsx from 'classnames';
import { Group, Stack } from '@/components';
import { ImportDropzone } from './ImportDropzone';
import { ImportSampleDownload } from './ImportSampleDownload';
import { CLASSES } from '@/constants';
import { Button, Intent } from '@blueprintjs/core';
import { ImportFileUploadForm } from './ImportFileUploadForm';
import { useFormikContext } from 'formik';

export function ImportFileUploadStep() {
  return (
    <ImportFileUploadForm>
      <p style={{ marginBottom: 18 }}>
        Download a sample file and compare it to your import file to ensure you
        have the file perfect for the import.
      </p>

      <Stack spacing={40}>
        <ImportDropzone />
        <ImportSampleDownload />
      </Stack>
      <ImportFileUploadFooterActions />
    </ImportFileUploadForm>
  );
}

function ImportFileUploadFooterActions() {
  const { isSubmitting } = useFormikContext();
  return (
    <div className={clsx(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group spacing={10}>
        <Button type="submit" intent={Intent.PRIMARY} loading={isSubmitting}>
          Next
        </Button>
        <Button>Cancel</Button>
      </Group>
    </div>
  );
}
