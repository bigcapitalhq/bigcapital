import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
// import {} from 'hooks/query';

const RolesListContext = React.createContext();

/**
 * Roles list provider.
 */
function RolesListProvider({ ...props }) {
  // Provider state.
  const provider = {};
  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <RolesListContext.Provider value={provider} {...props} />
    </div>
  );
}

const useRolesContext = () => React.useContext(RolesListContext);

export { RolesListProvider, useRolesContext };
