import React from 'react';
import styled from 'styled-components';

import { Card } from 'components';

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

      <div className="expense-drawer__content">
        <Card>
          <ExpenseDrawerHeader />
          <ExpenseDrawerTable />
          <ExpenseDrawerFooter />
        </Card>
      </div>
    </ExpenseDetailsRoot>
  );
}

const ExpenseDetailsRoot = styled.div``;