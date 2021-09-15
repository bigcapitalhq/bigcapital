import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';

/**
 * Format the given date.
 */
export function FormatDate({ value, format = 'YYYY MMM DD' }) {
  const localizedFormat = intl.get(`date_format.${format}`);

  return moment().format(localizedFormat);
}

/**
 * Format date table cell.
 */
export function FormatDateCell({ value, column: { formatDate } }) {
  return <FormatDate value={value} {...formatDate} />;
}
