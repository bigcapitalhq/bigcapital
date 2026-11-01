import { MenuItem } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { VendorDetails } from '@/containers/Drawers/VendorDetailsDrawer/VendorDetailsDrawerProvider';

interface ContactListRenderProps {
  handleClick: (event: React.MouseEvent) => void;
}

interface CreatedItem {
  name: string;
}

/**
 * Vendor row used by the select dropdown. The backend list response carries
 * `formattedBalance` for display; we extend the SDK `Vendor` shape via the
 * drawer's `VendorDetails` augmentation.
 */
type VendorSelectRow = Pick<VendorDetails, 'id' | 'displayName'> &
  Partial<Pick<VendorDetails, 'formattedBalance'>>;

// Filter Contact List
export const itemPredicate = (
  query: string,
  contact: VendorSelectRow,
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
  contact: VendorSelectRow,
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

// Handle quick create new vendor.
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
