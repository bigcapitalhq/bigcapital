import React, { useContext } from 'react';
import TableContext from './TableContext';

/**
 * Table no-results row text.
 */
export default function TableNoResultsRow() {
  const {
    props: { noResults }
  } = useContext(TableContext);

  return (
    <div className={'tr no-results'}>
      <div class="td">{ noResults }</div>
    </div>
  );
}