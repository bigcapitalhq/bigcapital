import { DRAWERS } from '@/constants/drawers';
import { index as CreditNoteDetailDrawer } from '@/containers/Drawers/CreditNoteDetailDrawer';
import { CreditNoteSendMailDrawer } from '@/containers/Sales/CreditNotes/CreditNoteSendMailDrawer';

export function CreditNotesListDrawers() {
  return (
    <>
      <CreditNoteDetailDrawer name={DRAWERS.CREDIT_NOTE_DETAILS} />
      <CreditNoteSendMailDrawer name={DRAWERS.CREDIT_NOTE_SEND_MAIL} />
    </>
  );
}
