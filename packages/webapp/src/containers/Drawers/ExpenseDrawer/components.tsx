// @ts-nocheck
import React from 'react';
import { Tag, Intent } from '@blueprintjs/core';

import { T } from '@/components';

/**
 * Expense details status.
 * @returns {React.JSX}
 */
export function ExpenseDetailsStatus({ expense }) {
  return expense.is_published ? (
    <Tag round={true} minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag round={true} intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
}
