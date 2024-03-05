// @ts-nocheck
import { DrawerBody } from '@/components';
import { CategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { CategorizeTransactionForm } from './CategorizeTransactionForm';

export default function CategorizeTransactionContent({
  uncategorizedTransactionId,
}) {
  return (
    <CategorizeTransactionBoot
      uncategorizedTransactionId={uncategorizedTransactionId}
    >
      <DrawerBody>
        <CategorizeTransactionForm />
      </DrawerBody>
    </CategorizeTransactionBoot>
  );
}
