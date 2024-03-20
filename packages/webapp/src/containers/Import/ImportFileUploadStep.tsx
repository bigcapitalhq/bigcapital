// @ts-nocheck
import { Stack } from '@/components';
import { ImportDropzone } from './ImportDropzone';
import { ImportSampleDownload } from './ImportSampleDownload';
import { ImportFileUploadForm } from './ImportFileUploadForm';
import { ImportFileUploadFooterActions } from './ImportFileFooterActions';
import { ImportFileContainer } from './ImportFileContainer';

export function ImportFileUploadStep() {
  return (
    <ImportFileUploadForm>
      <ImportFileContainer>
        <p style={{ marginBottom: 18 }}>
          Download a sample file and compare it to your import file to ensure
          you have the file perfect for the import.
        </p>
        <Stack spacing={40}>
          <ImportDropzone />
          <ImportSampleDownload />
        </Stack>
      </ImportFileContainer>

      <ImportFileUploadFooterActions />
    </ImportFileUploadForm>
  );
}
