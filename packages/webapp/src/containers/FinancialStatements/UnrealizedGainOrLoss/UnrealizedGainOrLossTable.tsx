import React from 'react';
import intl from 'react-intl-universal';
import { FinancialSheet } from '@/components';

interface UnrealizedGainOrLossTableProps {
  companyName: string;
}

export function UnrealizedGainOrLossTable({
  companyName,
}: UnrealizedGainOrLossTableProps) {
  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('unrealized_gain_or_loss.label')}
    ></FinancialSheet>
  );
}
