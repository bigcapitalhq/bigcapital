import { useCallback, useMemo } from 'react';
import clsx from 'classnames';
import { Button, Intent, Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { Box, FSelect, Group, Hint } from '@/components';
import { ImportFileMappingForm } from './ImportFileMappingForm';
import { EntityColumnField, useImportFileContext } from './ImportFileProvider';
import { CLASSES } from '@/constants';
import { ImportFileContainer } from './ImportFileContainer';
import { ImportStepperStep } from './_types';
import { ImportFileMapBootProvider } from './ImportFileMappingBoot';
import styles from './ImportFileMapping.module.scss';
import { getFieldKey } from './_utils';

export function ImportFileMapping() {
  const { importId, entityColumns } = useImportFileContext();

  return (
    <ImportFileMapBootProvider importId={importId}>
      <ImportFileMappingForm>
        <ImportFileContainer>
          <p>
            Review and map the column headers in your csv/xlsx file with the
            Bigcapital fields.
          </p>

          {entityColumns.map((entityColumn, index) => (
            <ImportFileMappingGroup
              groupKey={entityColumn.groupKey}
              groupLabel={entityColumn.groupLabel}
              fields={entityColumn.fields}
            />
          ))}
        </ImportFileContainer>
        <ImportFileMappingFloatingActions />
      </ImportFileMappingForm>
    </ImportFileMapBootProvider>
  );
}

interface ImportFileMappingGroupProps {
  groupKey: string;
  groupLabel: string;
  fields: any;
}

/**
 * Mapping fields group
 * @returns {React.ReactNode}
 */
function ImportFileMappingGroup({
  groupKey,
  groupLabel,
  fields,
}: ImportFileMappingGroupProps) {
  return (
    <Box className={styles.group}>
      {groupLabel && <h3 className={styles.groupTitle}>{groupLabel}</h3>}

      <table className={clsx('bp4-html-table', styles.table)}>
        <thead>
          <tr>
            <th className={styles.label}>Bigcapital Fields</th>
            <th className={styles.field}>Sheet Column Headers</th>
          </tr>
        </thead>
        <tbody>
          <ImportFileMappingFields fields={fields} />
        </tbody>
      </table>
    </Box>
  );
}

interface ImportFileMappingFieldsProps {
  fields: EntityColumnField[];
}

/**
 * Import mapping fields.
 * @returns {React.ReactNode}
 */
function ImportFileMappingFields({ fields }: ImportFileMappingFieldsProps) {
  const { sheetColumns } = useImportFileContext();

  const items = useMemo(
    () => sheetColumns.map((column) => ({ value: column, text: column })),
    [sheetColumns],
  );
  const columnMapper = useCallback(
    (column: EntityColumnField, index: number) => (
      <tr key={index}>
        <td className={styles.label}>
          {column.name}{' '}
          {column.required && <span className={styles.requiredSign}>*</span>}
        </td>
        <td className={styles.field}>
          <Group spacing={4}>
            <FSelect
              name={getFieldKey(column.key, column.group)}
              items={items}
              popoverProps={{ minimal: true }}
              minimal={true}
              fill={true}
            />
            {column.hint && (
              <Hint content={column.hint} position={Position.BOTTOM} />
            )}
          </Group>
        </td>
      </tr>
    ),
    [items],
  );
  const columns = useMemo(
    () => fields.map(columnMapper),
    [columnMapper, fields],
  );
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
        <Button onClick={handleCancelBtnClick}>Back</Button>
        <Button type="submit" intent={Intent.PRIMARY} loading={isSubmitting}>
          Next
        </Button>
      </Group>
    </div>
  );
}
