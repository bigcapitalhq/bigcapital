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

export const addressTextFormat = (
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
  let formattedMessage = Object.entries(replacements).reduce(
    (msg, [key, value]) => {
      return value ? msg.split(`{${key}}`).join(value) : msg;
    },
    message
  );
  formattedMessage = formattedMessage.replace(/\n/g, '<br />');

  return formattedMessage.trim();
};
