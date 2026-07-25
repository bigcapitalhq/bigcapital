import { MenuItem } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { CustomerDetails } from '@/containers/Drawers/CustomerDetailsDrawer/CustomerDetailsDrawerProvider';

interface ContactListRenderProps {
  handleClick: (event: React.MouseEvent) => void;
}

interface CreatedItem {
  name: string;
}

/**
 * Customer row used by the select dropdown. The backend list response carries
 * `formatted_balance` for display; we extend the SDK `Customer` shape via the
 * drawer's `CustomerDetails` augmentation.
 */
type CustomerSelectRow = Pick<CustomerDetails, 'id' | 'displayName'> &
  Partial<Pick<CustomerDetails, 'formattedBalance'>>;

// Filter Contact List
export const itemPredicate = (
  query: string,
  contact: CustomerSelectRow,
  _index: number,
  exactMatch: boolean,
) => {
  const normalizedTitle = contact.displayName.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${contact.displayName} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
    );
  }
};

export const handleContactRenderer = (
  contact: CustomerSelectRow,
  { handleClick }: ContactListRenderProps,
) => (
  <MenuItem key={contact.id} text={contact.displayName} onClick={handleClick} />
);

// Creates a new item from query.
export const createNewItemFromQuery = (name: string): CreatedItem => {
  return {
    name,
  };
};

// Handle quick create new customer.
export const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: (event: React.MouseEvent) => void,
) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      shouldDismissPopover={false}
      onClick={handleClick}
    />
  );
};
