// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Button, Intent } from '@blueprintjs/core';
import { Icon, FormattedMessage as T } from '@/components';
import { useDialogActions } from '@/hooks/state';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import ApiKeysDataTable from './ApiKeysDataTable';
import { compose } from '@/utils';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';

/**
 * API Keys preferences page.
 */
function ApiKeysPreferences({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { openDialog } = useDialogActions();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('api_keys'));
  }, [changePreferencesPageTitle]);

  const handleGenerateApiKey = () => {
    openDialog('api-keys-generate');
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <Card>
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: 0 }}>
              <T id={'api_keys'} />
            </h2>
            <Button
              intent={Intent.PRIMARY}
              icon={<Icon icon="plus" />}
              onClick={handleGenerateApiKey}
            >
              <T id={'generate_api_key'} />
            </Button>
          </div>
          <ApiKeysDataTable />
        </div>
      </Card>
    </div>
  );
}

export default compose(withDashboardActions)(ApiKeysPreferences);
