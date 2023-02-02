// @ts-nocheck
import React, { useContext } from 'react';
import intl from 'react-intl-universal';
import TableContext from './TableContext';

/**
 * Table no-results row text.
 */
export default function TableNoResultsRow() {
  const {
    props: { noResults },
  } = useContext(TableContext);

  const noResultText =
    noResults || intl.get('there_is_no_results_in_the_table');

  return (
    <div className={'tr no-results'}>
      <div class="td">{noResultText}</div>
    </div>
  );
}
