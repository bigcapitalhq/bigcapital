// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { CommercialDocBox } from '@/components';

import ExpenseDrawerActionBar from './ExpenseDrawerActionBar';
import ExpenseDrawerHeader from './ExpenseDrawerHeader';
import ExpenseDrawerTable from './ExpenseDrawerTable';
import ExpenseDrawerFooter from './ExpenseDrawerFooter';

/**
 * Expense view details.
 */
export default function ExpenseDrawerDetails() {
  return (
    <ExpenseDetailsRoot>
      <ExpenseDrawerActionBar />

      <CommercialDocBox>
        <ExpenseDrawerHeader />
        <ExpenseDrawerTable />
        <ExpenseDrawerFooter />
      </CommercialDocBox>
    </ExpenseDetailsRoot>
  );
}

const ExpenseDetailsRoot = styled.div``;
