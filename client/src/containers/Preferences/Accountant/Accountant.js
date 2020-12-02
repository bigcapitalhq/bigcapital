import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import { CLASSES } from 'common/classes';
import { LoadingIndicator } from 'components';
import AccountantForm from './AccountantForm';
import { AccountantSchema } from './Accountant.schema';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';

import { compose } from 'utils';

// Accountant preferences.
function AccountantPreferences({
  changePreferencesPageTitle,

  // #withAccountsActions
  requestFetchAccounts,
}) {
  const initialValues = {};

  useEffect(() => {
    changePreferencesPageTitle('Accountant');
  }, [changePreferencesPageTitle]);

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <LoadingIndicator loading={fetchAccounts.isFetching} spinnerSize={28}>
          <Formik
            initialValues={initialValues}
            validationSchema={AccountantSchema}
            component={AccountantForm}
          />
        </LoadingIndicator>
      </div>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({ organizationSettings })),
  withSettingsActions,
  withDashboardActions,
  withAccountsActions,
)(AccountantPreferences);
