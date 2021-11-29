import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  useSettingEasySMS,
  useSettingEasySMSDisconnect,
  useSettingEasySMSIntegrate,
} from 'hooks/query';

const EasySMSIntegrationContext = React.createContext();

/**
 * Easysms integration data provider.
 */
function EasySMSIntegrationProvider({ ...props }) {
  // Provider
  const provider = {};

  return (
    <div className={classNames(CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT)}>
      <EasySMSIntegrationContext.Provider value={provider} {...props} />
    </div>
  );
}

const useEasySMSIntegrationContext = () =>
  React.useContext(EasySMSIntegrationContext);

export { EasySMSIntegrationProvider, useEasySMSIntegrationContext };
