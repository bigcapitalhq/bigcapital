// @ts-nocheck
import styled from 'styled-components';

export const FinancialSheetRoot = styled.div`
  border: 2px solid var(--color-financial-sheet-card-border);
  border-radius: 10px;
  min-width: 640px;
  width: auto;
  padding: 30px 18px;
  max-width: 100%;
  margin: 35px auto;
  min-height: 400px;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.fullWidth &&
    `
    width: 100%;
    margin-top: 25px;`}

  ${(props) =>
    props.minimal &&
    `
    border: 0;
    padding: 0;
    margin-top: 20px;

  ${FinancialSheetTitle} {
    font-size: 18px;
    color: var(--color-financial-sheet-minimal-title-text);
  }
  ${FinancialSheetTitle} + ${FinancialSheetDate} {
    margin-top: 8px;
  }
  ${FinancialSheetDate} {
    margin-top: 20px;
  }  
`}
`;

export const FinancialSheetTitle = styled.h1`
  margin: 0;
  font-weight: 400;
  font-size: 20px;
  color: var(--color-financial-sheet-title-text);
  text-align: center;
`;

export const FinancialSheetType = styled.h6`
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-financial-sheet-type-text);
  margin-top: 6px;
`;

export const FinancialSheetDate = styled.div`
  text-align: center;
  color: var(--color-financial-sheet-date-text);
  margin-top: 6px;
`;

export const FinancialSheetFooter = styled.div`
  color: var(--color-financial-sheet-footer-text);
  text-align: center;
  margin-top: auto;
  padding-top: 18px;
  font-size: 13px;

  > span + span {
    padding-left: 10px;
  }
`;
export const FinancialSheetTable = styled.div`
  margin-top: 24px;
`;
export const FinancialSheetFooterBasis = styled.span``;
export const FinancialSheetFooterCurrentTime = styled.span``;

export const FinancialSheetAccountingBasis = styled.div``;
