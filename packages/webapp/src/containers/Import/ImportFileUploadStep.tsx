// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import { Stack } from '@/components';
import { ImportDropzone } from './ImportDropzone';
import { ImportSampleDownload } from './ImportSampleDownload';
import { ImportFileUploadForm } from './ImportFileUploadForm';
import { ImportFileUploadFooterActions } from './ImportFileFooterActions';
import { ImportFileContainer } from './ImportFileContainer';
import { useImportFileContext } from './ImportFileProvider';

export function ImportFileUploadStep() {
  const { exampleDownload } = useImportFileContext();

  return (
    <ImportFileUploadForm>
      <ImportFileContainer>
        <p
          className={Classes.TEXT_MUTED}
          style={{ marginBottom: 18, lineHeight: 1.6 }}
        >
          Download a sample file and compare it with your import file to ensure
          it is properly formatted. It's not necessary for the columns to be in
          the same order, you can map them later.
        </p>

        <Stack spacing={40}>
          <ImportDropzone />
          {exampleDownload && <ImportSampleDownload />}
        </Stack>
      </ImportFileContainer>

      <ImportFileUploadFooterActions />
    </ImportFileUploadForm>
  );
}
