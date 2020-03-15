import React, { Children } from 'react';


export default function FinancialSheet({
  companyTitle,
  sheetType,
  date,
  children,
  accountingBasis
}) {
  return (
    <div class="financial-sheet">
      <h1 class="financial-sheet__title">{ companyTitle }</h1>
      <h6 class="financial-sheet__sheet-type">{ sheetType }</h6>
      <span class="financial-sheet__date">{ date }</span>

      <div class="financial-sheet__table">
        { children }
      </div>

      <div class="financial-sheet__accounting-basis">
        { accountingBasis }
      </div>
    </div>
  );
}