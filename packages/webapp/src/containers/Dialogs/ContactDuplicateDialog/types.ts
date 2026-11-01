export interface ContactDuplicateFormValues {
  contactType: string;
}

export type ContactDuplicateDialogPayload = {
  contactId?: number | null;
};

export type ContactDuplicateContextValue = {
  dialogName: string;
  contactId?: number | null;
};
