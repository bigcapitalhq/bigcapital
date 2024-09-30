import { IContact } from '@/interfaces';

interface OrganizationAddressFormatArgs {
  organizationName?: string;
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

const defaultMessage = `
  <strong>{ORGANIZATION_NAME}</strong>
  {ADDRESS_1},
  {ADDRESS_2},
  {CITY} {STATE},
  {POSTAL_CODE},
  {COUNTRY}
`;

const formatText = (message: string, replacements: Record<string, string>) => {
  let formattedMessage = Object.entries(replacements).reduce(
    (msg, [key, value]) => {
      return msg.split(`{${key}}`).join(value || '');
    },
    message
  );
  formattedMessage = formattedMessage.replace(/\n/g, '<br />');

  return formattedMessage.trim();
};

export const organizationAddressTextFormat = (
  message: string,
  args: OrganizationAddressFormatArgs
) => {
  const replacements: Record<string, string> = {
    ORGANIZATION_NAME: args.organizationName || '',
    ADDRESS_1: args.address1 || '',
    ADDRESS_2: args.address2 || '',
    CITY: args.city || '',
    STATE: args.state || '',
    POSTAL_CODE: args.postalCode || '',
    COUNTRY: args.country || '',
  };
  return formatText(message, replacements);
};

interface ContactAddressTextFormatArgs {
  displayName?: string;
  state?: string;
  postalCode?: string;
  email?: string;
  country?: string;
  city?: string;
  address2?: string;
  address1?: string;
}

const contactFormatMessage = `{CONTACT_NAME}
{ADDRESS_1}
{ADDRESS_2}
{CITY} {STATE}
{POSTAL_CODE}
{COUNTRY}
{EMAIL}
`;

export const contactAddressTextFormat = (
  contact: IContact,
  message: string = contactFormatMessage
) => {
  const args = {
    displayName: contact.displayName,
    address1: contact.billingAddress1,
    address2: contact.billingAddress2,
    state: contact.billingAddressState,
    country: contact.billingAddressCountry,
    postalCode: contact?.billingAddressPostcode,
    city: contact?.billingAddressCity,
    email: contact?.email,
  } as ContactAddressTextFormatArgs;

  const replacements: Record<string, string> = {
    CONTACT_NAME: args.displayName || '',
    ADDRESS_1: args.address1 || '',
    ADDRESS_2: args.address2 || '',
    CITY: args.city || '',
    STATE: args.state || '',
    POSTAL_CODE: args.postalCode || '',
    COUNTRY: args.country || '',
    EMAIL: args?.email || '',
  };
  return formatText(message, replacements);
};
