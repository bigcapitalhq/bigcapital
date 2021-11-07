import React from 'react';
import { DialogContent } from 'components';
// import {  } from 'hooks/query';

const NotifyEstimateViaSMSContext = React.createContext();

function NotifyEstimateViaSMSFormProvider({
  estimateId,
  dialogName,
  ...props
}) {
  // State provider.
  const provider = {
    estimateId,
    dialogName,
  };

  return (
    <DialogContent
    // isLoading={}
    >
      <NotifyEstimateViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useEstimateViaSMSContext = () =>
  React.useContext(NotifyEstimateViaSMSContext);

export { NotifyEstimateViaSMSFormProvider, useEstimateViaSMSContext };
