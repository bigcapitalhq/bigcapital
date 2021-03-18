import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import { CLASSES } from 'common/classes';
import AccountantForm from './AccountantForm';
import { AccountantSchema } from './Accountant.schema';
import { useAccountantFormContext } from './AccountantFormProvider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

import 'style/pages/Preferences/Accounting.scss';

// Accountant preferences.
function AccountantFormPage({ changePreferencesPageTitle }) {

  const { saveSettingMutate } = useAccountantFormContext();

  const initialValues = {};

  useEffect(() => {
    changePreferencesPageTitle('Accountant');
  }, [changePreferencesPageTitle]);

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <Formik
          initialValues={initialValues}
          validationSchema={AccountantSchema}
          component={AccountantForm}
        />
      </div>
    </div>
  );
}

export default compose(withDashboardActions)(AccountantFormPage);
