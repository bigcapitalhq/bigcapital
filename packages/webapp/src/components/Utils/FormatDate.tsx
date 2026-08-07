import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';

interface FormatDateProps {
  value: string | Date | undefined | null;
  format?: string;
}

/**
 * Format the given date.
 */
export function FormatDate({ value, format = 'YYYY MMM DD' }: FormatDateProps) {
  const localizedFormat = intl.get(`date_formats.${format}`);

  return <>{moment(value).format(localizedFormat)}</>;
}

interface FormatDateCellProps {
  value: string | Date | undefined | null;
  column: { formatDate?: { format?: string } };
}

/**
 * Format date table cell.
 */
export function FormatDateCell({
  value,
  column: { formatDate },
}: FormatDateCellProps) {
  return <FormatDate value={value} {...formatDate} />;
}
