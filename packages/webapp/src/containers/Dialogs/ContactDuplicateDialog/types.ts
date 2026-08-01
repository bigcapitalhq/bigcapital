export interface ContactDuplicateFormValues {
  contact_type: string;
}

export type ContactDuplicateDialogPayload = {
  contactId?: number | null;
};

export type ContactDuplicateContextValue = {
  dialogName: string;
  contactId?: number | null;
};
