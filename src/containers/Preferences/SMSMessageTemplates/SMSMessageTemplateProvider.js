import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useSettings, useSaveSettings } from 'hooks/query';

import PreferencesPageLoader from '../PreferencesPageLoader';

const SMSMessageTemplateContext = React.createContext();

/**
 * SMS message template provider.
 */
function SMSMessageTemplateProvider({ ...props }) {
  
  //Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Provider state.
  const provider = {};

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        {isSettingsLoading ? (
          <PreferencesPageLoader />
        ) : (
          <SMSMessageTemplateContext.Provider value={provider} {...props} />
        )}
      </div>
    </div>
  );
}

const useSMSMessageTemplateContext = () =>
  React.useContext(SMSMessageTemplateContext);

export { SMSMessageTemplateProvider, useSMSMessageTemplateContext };
