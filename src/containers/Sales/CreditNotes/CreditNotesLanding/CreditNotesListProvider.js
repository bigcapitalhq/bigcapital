import React from 'react';
import { isEmpty } from 'lodash';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { getFieldsFromResourceMeta } from 'utils';

const CreditNoteListContext = React.createContext();

/**
 * Credit note data provider.
 */
function CreditNotesListProvider({ query, tableStateChanged, ...props }) {
  // Provider payload.
  const provider = {};

  return (
    <DashboardInsider
      // loading={}
      name={'credit-note-list'}
    >
      <CreditNoteListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteListContext = () => React.useContext(CreditNoteListContext);

export { CreditNotesListProvider , useCreditNoteListContext };
