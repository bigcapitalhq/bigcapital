

import React from 'react';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import CurrenciesList from './CurrenciesList';

export default function PreferencesCurrenciesPage() {
  return (
    <div className={classNames(
      CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
      CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_CURRENCIES,
    )}>
      <div className={classNames(CLASSES.CARD)}>
        <CurrenciesList />
      </div>
    </div>
  )
}