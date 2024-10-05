import { IContact } from '@/interfaces';

interface OrganizationAddressFormatArgs {
  organizationName?: string;
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}

export const defaultOrganizationAddressFormat = `
<strong>{ORGANIZATION_NAME}</strong>
{ADDRESS_1}
{ADDRESS_2}
{CITY} {STATE} {POSTAL_CODE}
{COUNTRY}
{PHONE}
`;
/**
 * Formats the address text based on the provided message and arguments.
 * This function replaces placeholders in the message with actual values
 * from the OrganizationAddressFormatArgs. It ensures that the final
 * formatted message is clean and free of excessive newlines.
 *
 * @param {string} message - The message template containing placeholders.
 * @param {Record<string, string>} args - The arguments containing the values to replace in the message.
 * @returns {string} - The formatted address text.
 */
const formatText = (message: string, replacements: Record<string, string>) => {
  let formattedMessage = Object.entries(replacements).reduce(
    (msg, [key, value]) => {
      return msg.split(`{${key}}`).join(value || '');
    },
    message
  );
  // Removes any empty lines.
  formattedMessage = formattedMessage.replace(/^\s*[\r\n]/gm, '');
  formattedMessage = formattedMessage.replace(/\n{2,}/g, '\n');
  formattedMessage = formattedMessage.replace(/\n/g, '<br />');
  formattedMessage = formattedMessage.trim();

  return formattedMessage;
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
    PHONE: args.phone || '',
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
  phone?: string;
}

export const defaultContactAddressFormat = `{CONTACT_NAME}
{ADDRESS_1}
{ADDRESS_2}
{CITY} {STATE} {POSTAL_CODE}
{COUNTRY}
{PHONE}
`;

export const contactAddressTextFormat = (
  contact: IContact,
  message: string = defaultContactAddressFormat
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
    phone: contact?.billingAddressPhone,
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
    PHONE: args?.phone || '',
  };
  return formatText(message, replacements);
};
