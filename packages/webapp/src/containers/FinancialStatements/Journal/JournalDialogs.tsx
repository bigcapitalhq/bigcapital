import React from 'react';
import { JournalPdfDialog } from './dialogs/JournalPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function JournalDialogs() {
  return (
    <>
      <JournalPdfDialog dialogName={DialogsName.JournalPdfPreview} />
    </>
  );
}
