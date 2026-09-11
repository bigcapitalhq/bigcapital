import React from 'react';
import { ShortcutBoxesSection } from './ShortcutBoxesSection';
import { financialAccounting } from '@/constants/homepageOptions';

export function FinancialAccountingSection() {
  return <ShortcutBoxesSection section={financialAccounting} />;
}
