import { useMemo } from 'react';
import clsx from 'classnames';
import { FSelect, Group } from '@/components';
import { ImportFileMappingForm } from './ImportFileMappingForm';
import { useImportFileContext } from './ImportFileProvider';
import styles from './ImportFileMapping.module.scss';
import { CLASSES } from '@/constants';
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';

export function ImportFileMapping() {
  return (
    <ImportFileMappingForm>
      <p>
        Review and map the column headers in your csv/xlsx file with the
        Bigcapital fields.
      </p>

      <table className={clsx('bp4-html-table', styles.table)}>
        <thead>
          <tr>
            <th className={'label'}>Bigcapital Fields</th>
            <th className={'field'}>Sheet Column Headers</th>
          </tr>
        </thead>
        <tbody>
          <ImportFileMappingFields />
        </tbody>
      </table>

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
      <td className={'label'}>{column.name}</td>
      <td className={'field'}>
        <FSelect
          name={column.key}
          items={items}
          fill
          popoverProps={{ minimal: false }}
          minimal={false}
        />
      </td>
    </tr>
  ));
  return <>{columns}</>;
}

function ImportFileMappingFloatingActions() {
  const { isSubmitting } = useFormikContext();

  return (
    <div className={clsx(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group>
        <Button type="submit" intent={Intent.PRIMARY} loading={isSubmitting}>
          Next
        </Button>
        <Button>Cancel</Button>
      </Group>
    </div>
  );
}
