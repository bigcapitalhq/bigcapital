// @ts-nocheck
import { Button, Callout, Intent, Text } from '@blueprintjs/core';
import clsx from 'classnames';
import { useHistory } from 'react-router-dom';
import {
  ImportFilePreviewBootProvider,
  useImportFilePreviewBootContext,
} from './ImportFilePreviewBoot';
import { useImportFileContext } from './ImportFileProvider';
import { AppToaster, Card, Group } from '@/components';
import { useImportFileProcess } from '@/hooks/query/import';
import { CLASSES } from '@/constants';
import { ImportStepperStep } from './_types';

export function ImportFilePreview() {
  const { importId } = useImportFileContext();

  return (
    <ImportFilePreviewBootProvider importId={importId}>
      <ImportFilePreviewContent />
    </ImportFilePreviewBootProvider>
  );
}

function ImportFilePreviewContent() {
  const { importPreview } = useImportFilePreviewBootContext();

  return (
    <div>
      <Callout>
        {importPreview.createdCount} of {importPreview.totalCount} Items in your
        file are ready to be imported.
      </Callout>

      <Card>
        <Text>
          Items that are ready to be imported - {importPreview.createdCount}
        </Text>
        <ul>
          <li>Items to be created: ({importPreview.createdCount})</li>
          <li>Items to be skipped: ({importPreview.skippedCount})</li>
          <li>Items have errors: ({importPreview.errorsCount})</li>
        </ul>

        <table className={clsx('bp4-html-table')}>
          <thead>
            <tr>
              <th className={'number'}>#</th>
              <th className={'name'}>Name</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {importPreview?.errors.map((error, key) => (
              <tr key={key}>
                <td>{error.rowNumber}</td>
                <td>{error.rowNumber}</td>
                <td>
                  {error.errorMessage.map((message) => (
                    <div>{message}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Text>
          Unmapped Sheet Columns - ({importPreview?.unmappedColumnsCount})
        </Text>

        <ul>
          {importPreview.unmappedColumns?.map((column, key) => (
            <li key={key}>{column}</li>
          ))}
        </ul>
      </Card>

      <ImportFilePreviewFloatingActions />
    </div>
  );
}

function ImportFilePreviewFloatingActions() {
  const { importId, setStep } = useImportFileContext();
  const { importPreview } = useImportFilePreviewBootContext();
  const { mutateAsync: importFile, isLoading: isImportFileLoading } =
    useImportFileProcess();

  const history = useHistory();
  const isValidToImport = importPreview?.createdCount > 0;

  const handleSubmitBtn = () => {
    importFile(importId)
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: `The ${
            importPreview.createdCount
          } of ${10} has imported successfully.`,
        });
        history.push('/accounts');
      })
      .catch((error) => {});
  };
  const handleCancelBtnClick = () => {
    setStep(ImportStepperStep.Mapping);
  };

  return (
    <div className={clsx(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group spacing={10}>
        <Button onClick={handleCancelBtnClick}>Cancel</Button>
        <Button
          type="submit"
          intent={Intent.PRIMARY}
          loading={isImportFileLoading}
          onClick={handleSubmitBtn}
          disabled={!isValidToImport}
        >
          Import
        </Button>
      </Group>
    </div>
  );
}
