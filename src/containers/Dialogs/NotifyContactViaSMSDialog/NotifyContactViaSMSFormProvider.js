import React from 'react';
import { DialogContent } from 'components';
import { useCustomers } from 'hooks/query';

const NotifyContactViaSMSContext = React.createContext();

/**
 * Notify contact via SMS provider.
 */
function NotifyContactViaSMSFormProvider({ dialogName, ...props }) {
  // Fetches customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers();

  // State provider.
  const provider = {
    dialogName,
    customers,
  };

  return (
    <DialogContent isLoading={isCustomersLoading}>
      <NotifyContactViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyContactViaSMSContext = () =>
  React.useContext(NotifyContactViaSMSContext);

export { NotifyContactViaSMSFormProvider, useNotifyContactViaSMSContext };
