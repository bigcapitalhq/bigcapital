import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { CurrenciesList } from './CurrenciesList';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';

export function PreferencesCurrenciesPage() {
  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_CURRENCIES,
      )}
    >
      <CurrenciesCard>
        <CurrenciesList />
      </CurrenciesCard>
    </div>
  );
}

const CurrenciesCard = styled(Card)`
  padding: 0;
`;
