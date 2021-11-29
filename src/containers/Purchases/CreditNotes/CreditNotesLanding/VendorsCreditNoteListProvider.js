import React from 'react';
import { isEmpty } from 'lodash';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { getFieldsFromResourceMeta } from 'utils';

const VendorsCreditNoteListContext = React.createContext();
/**
 * Vendors Credit note data provider.
 */
function VendorsCreditNoteListProvider({ query, tableStateChanged, ...props }) {
  // Provider payload.
  const provider = {};
  return (
    <DashboardInsider
      // loading={}
      name={'vendors-credit-note-list'}
    >
      <VendorsCreditNoteListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorsCreditNoteListContext = () =>
  React.useContext(VendorsCreditNoteListContext);

export { VendorsCreditNoteListProvider, useVendorsCreditNoteListContext };
