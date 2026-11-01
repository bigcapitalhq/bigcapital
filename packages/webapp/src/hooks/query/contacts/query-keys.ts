// Query key constants
export const CONTACTS = 'CONTACTS';
export const CONTACT = 'CONTACT';

// Query key factory
export const contactsKeys = {
  all: () => [CONTACTS] as const,
  detail: (id: number | string | null | undefined) => [CONTACT, id] as const,
  autoComplete: () => [CONTACTS, 'AUTO-COMPLETE'] as const,
};

// Grouped object for use in components/hooks
export const ContactsQueryKeys = {
  CONTACTS,
  CONTACT,
} as const;
