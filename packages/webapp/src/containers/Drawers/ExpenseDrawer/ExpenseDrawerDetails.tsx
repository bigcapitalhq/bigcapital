import React from 'react';
import styled from 'styled-components';
import { ExpenseDrawerActionBar } from './ExpenseDrawerActionBar';
import { ExpenseDrawerFooter } from './ExpenseDrawerFooter';
import { ExpenseDrawerHeader } from './ExpenseDrawerHeader';
import { ExpenseDrawerTable } from './ExpenseDrawerTable';
import { CommercialDocBox } from '@/components';

/**
 * Expense view details.
 */
export function ExpenseDrawerDetails() {
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
