import { useMemo } from 'react';
import { chain, isEmpty, lowerCase, head, last, set } from 'lodash';
import { useImportFileContext } from './ImportFileProvider';
import { useImportFileMapBootContext } from './ImportFileMappingBoot';
import { deepdash, transformToForm } from '@/utils';
import { ImportFileMappingFormValues } from './_types';

export const getFieldKey = (key: string, group = '') => {
  return group ? `${group}.${key}` : key;
};

type ImportFileMappingRes = { from: string; to: string; group: string }[];

/**
 * Transformes the mapping form values to request.
 * @param {ImportFileMappingFormValues} value
 * @returns {ImportFileMappingRes[]}
 */
export const transformValueToReq = (
  value: ImportFileMappingFormValues,
): { mapping: ImportFileMappingRes[] } => {
  const mapping = chain(value)
    .thru(deepdash.index)
    .pickBy((_value, key) => !isEmpty(_.get(value, key)))
    .map((from, key) => ({
      from,
      to: key.includes('.') ? last(key.split('.')) : key,
      group: key.includes('.') ? head(key.split('.')) : '',
    }))
    .value();

  return { mapping };
};

/**
 *
 * @param value
 * @returns
 */
export const transformResToFormValues = (
  value: { from: string; to: string }[],
) => {
  return value?.reduce((acc, map) => {
    acc[map.to] = map.from;
    return acc;
  }, {});
};

/**
 * Retrieves the initial values of mapping form.
 * @returns {Record<string, any>}
 */
export const useImportFileMappingInitialValues = () => {
  const { importFile } = useImportFileMapBootContext();
  const { entityColumns, sheetColumns } = useImportFileContext();

  const initialResValues = useMemo(
    () => transformResToFormValues(importFile?.map || []),
    [importFile?.map],
  );

  const initialValues = useMemo(
    () =>
      entityColumns.reduce((acc, { fields, groupKey }) => {
        fields.forEach(({ key, name }) => {
          const _name = lowerCase(name);
          const _matched = sheetColumns.find(
            (column) => lowerCase(column) === _name,
          );
          const _key = groupKey ? `${groupKey}.${key}` : key;
          const _value = _matched ? _matched : '';

          set(acc, _key, _value);
        });
        return acc;
      }, {}),
    [entityColumns, sheetColumns],
  );

  return useMemo<Record<string, any>>(
    () => ({
      ...transformToForm(initialResValues, initialValues),
      ...initialValues,
    }),
    [initialValues, initialResValues],
  );
};
