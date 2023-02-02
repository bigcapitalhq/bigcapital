// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';

/**
 * Format the given date.
 */
export function FormatDate({ value, format = 'YYYY MMM DD' }) {
  const localizedFormat = intl.get(`date_formats.${format}`);

  return moment(value).format(localizedFormat);
}

/**
 * Format date table cell.
 */
export function FormatDateCell({ value, column: { formatDate } }) {
  return <FormatDate value={value} {...formatDate} />;
}
