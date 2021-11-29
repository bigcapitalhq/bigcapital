import React from 'react';
import { DialogContent } from 'components';
import { useSettingEasySMSIntegrate } from 'hooks/query';

const EasySMSIntegrationDialogContext = React.createContext();
/**
 * Easy SMS integration dialog provider.
 */
function EasySMSIntegrationProvider({ dialogName, ...props }) {
  // State provider.
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <EasySMSIntegrationDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useEasySMSIntegration = () =>
  React.useContext(EasySMSIntegrationDialogContext);

export { EasySMSIntegrationProvider, useEasySMSIntegration };
