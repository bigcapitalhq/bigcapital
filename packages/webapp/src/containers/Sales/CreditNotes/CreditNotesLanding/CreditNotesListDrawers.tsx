import { DRAWERS } from '@/constants/drawers';
import { index as CreditNoteDetailDrawer } from '@/containers/Drawers/CreditNoteDetailDrawer';

export function CreditNotesListDrawers() {
  return (
    <>
      <CreditNoteDetailDrawer name={DRAWERS.CREDIT_NOTE_DETAILS} />
    </>
  );
}
