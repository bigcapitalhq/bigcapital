import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useSettings } from 'hooks/query';

const SMSMessagesTemplatesContext = React.createContext();

/**
 * SMS message templates provider.
 */
function SMSMessagesTemplatesProvider({ ...props }) {
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
        <SMSMessagesTemplatesContext.Provider value={provider} {...props} />
      </div>
    </div>
  );
}

const useSMSMessageTemplateContext = () =>
  React.useContext(SMSMessagesTemplatesContext);

export { SMSMessagesTemplatesProvider, useSMSMessageTemplateContext };
