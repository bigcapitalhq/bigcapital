// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import styled from 'styled-components';

import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import ApiKeysDataTable from './ApiKeysDataTable';
import { compose } from '@/utils';

/**
 * API Keys preferences page.
 */
function ApiKeysPreferences({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('api_key.title'));
  }, [changePreferencesPageTitle]);

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <ApiKeysPreferencesCard>
        <ApiKeysDataTable />
      </ApiKeysPreferencesCard>
    </div>
  );
}

const ApiKeysPreferencesCard = styled(Card)`
  padding: 0;
`;

export default compose(withDashboardActions)(ApiKeysPreferences);
