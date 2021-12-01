import React from 'react';
import { DialogContent } from 'components';
import { useSettingEasySMSIntegrate } from 'hooks/query';

const EasySMSIntegrationDialogContext = React.createContext();
/**
 * Easy SMS integration dialog provider.
 */
function EasySMSIntegrationProvider({ dialogName, ...props }) {
  // easysms integrate mutations.
  const { mutateAsync: easySMSIntegrateMutate } = useSettingEasySMSIntegrate();

  // State provider.
  const provider = {
    dialogName,
    easySMSIntegrateMutate,
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
