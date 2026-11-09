import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { transformToForm } from '@/utils';

// Default query for audit log
export const getDefaultAuditLogQuery = () => ({
  subject: [] as string[],
  action: [] as string[],
  fromDate: '',
  toDate: '',
});

// Validation schema
export const getAuditLogQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().optional(),
    toDate: Yup.date().min(Yup.ref('fromDate')).optional(),
  });
};

// Parse query from URL
const parseAuditLogQuery = (locationQuery: Record<string, unknown>) => {
  const defaultQuery = getDefaultAuditLogQuery();
  return {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
};

// Hook for managing query state
export const useAuditLogQuery = () => {
  const [locationQuery, setLocationQuery] = useState<Record<string, unknown>>(
    {},
  );

  const query = useMemo(
    () => parseAuditLogQuery(locationQuery),
    [locationQuery],
  );

  return { query, setLocationQuery };
};
