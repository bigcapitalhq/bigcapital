import { useMemo } from 'react';
import clsx from 'classnames';
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FSelect, Group } from '@/components';
import { ImportFileMappingForm } from './ImportFileMappingForm';
import { useImportFileContext } from './ImportFileProvider';
import { CLASSES } from '@/constants';
import { ImportFileContainer } from './ImportFileContainer';
import styles from './ImportFileMapping.module.scss';
import { ImportStepperStep } from './_types';

export function ImportFileMapping() {
  return (
    <ImportFileMappingForm>
      <ImportFileContainer>
        <p>
          Review and map the column headers in your csv/xlsx file with the
          Bigcapital fields.
        </p>

        <table className={clsx('bp4-html-table', styles.table)}>
          <thead>
            <tr>
              <th className={styles.label}>Bigcapital Fields</th>
              <th className={styles.field}>Sheet Column Headers</th>
            </tr>
          </thead>
          <tbody>
            <ImportFileMappingFields />
          </tbody>
        </table>
      </ImportFileContainer>

      <ImportFileMappingFloatingActions />
    </ImportFileMappingForm>
  );
}

function ImportFileMappingFields() {
  const { entityColumns, sheetColumns } = useImportFileContext();

  const items = useMemo(
    () => sheetColumns.map((column) => ({ value: column, text: column })),
    [sheetColumns],
  );

  const columns = entityColumns.map((column, index) => (
    <tr key={index}>
      <td className={styles.label}>{column.name}</td>
      <td className={styles.field}>
        <FSelect
          name={column.key}
          items={items}
          popoverProps={{ minimal: true }}
          minimal={true}
          fill={true}
        />
      </td>
    </tr>
  ));
  return <>{columns}</>;
}

function ImportFileMappingFloatingActions() {
  const { isSubmitting } = useFormikContext();
  const { setStep } = useImportFileContext();

  const handleCancelBtnClick = () => {
    setStep(ImportStepperStep.Upload);
  };

  return (
    <div className={clsx(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group spacing={10}>
        <Button onClick={handleCancelBtnClick}>Cancel</Button>
        <Button type="submit" intent={Intent.PRIMARY} loading={isSubmitting}>
          Next
        </Button>
      </Group>
    </div>
  );
}
