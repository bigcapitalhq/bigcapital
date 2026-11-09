import { Callout, Classes, Intent } from '@blueprintjs/core';
import { ImportAlert } from './_types';
import { AlertsManager, useAlertsManager } from './AlertsManager';
import { ImportDropzone } from './ImportDropzone';
import { ImportFileContainer } from './ImportFileContainer';
import { ImportFileUploadFooterActions } from './ImportFileFooterActions';
import { useImportFileContext } from './ImportFileProvider';
import { ImportFileUploadForm } from './ImportFileUploadForm';
import { ImportSampleDownload } from './ImportSampleDownload';
import { Stack } from '@/components';

function ImportFileUploadCallouts() {
  const { isAlertActive } = useAlertsManager();
  return (
    <>
      {isAlertActive(ImportAlert.IMPORTED_SHEET_EMPTY) && (
        <Callout intent={Intent.DANGER} icon={null}>
          The imported sheet is empty.
        </Callout>
      )}
    </>
  );
}

export function ImportFileUploadStep() {
  const { exampleDownload } = useImportFileContext();

  return (
    <AlertsManager>
      <ImportFileUploadForm>
        <ImportFileContainer>
          <p
            className={Classes.TEXT_MUTED}
            style={{ marginBottom: 18, lineHeight: 1.6 }}
          >
            Download a sample file and compare it with your import file to
            ensure it is properly formatted. It's not necessary for the columns
            to be in the same order, you can map them later.
          </p>

          <Stack>
            <ImportFileUploadCallouts />

            <Stack spacing={40}>
              <ImportDropzone />
              {exampleDownload && <ImportSampleDownload />}
            </Stack>
          </Stack>
        </ImportFileContainer>

        <ImportFileUploadFooterActions />
      </ImportFileUploadForm>
    </AlertsManager>
  );
}
