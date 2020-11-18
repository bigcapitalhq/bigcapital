import React from 'react';

function DatatableEmptyState({
  title,
  description,
  newButtonText,
  newButtonUrl,

  learnMoreButtonText,
  learnMoreButtonUrl,
}) {


  return (
    <div class={'datatable-empty-state'}>
      <h1 class={CLASSES.DATATABLE_EMPTY_STATE_TITLE}>
        { title }
      </h1>
    </div>
  )
}


export default function ExpensesEmptyState({

}) {


  return (
    <DatatableEmptyState
      title={''}
      description={''}
      newButtonText={''}
      newButtonUrl={''}

      learnMoreButtonText={''}
      learnMoreButtonUrl={''}
    />
  );
}