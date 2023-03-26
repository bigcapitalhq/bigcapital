// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import CurrenciesList from './CurrenciesList';

export default function PreferencesCurrenciesPage() {
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
