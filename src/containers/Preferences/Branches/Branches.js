import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import BranchesDataTable from './BranchesDataTable';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function Branches({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('branches.label'));
  }, [changePreferencesPageTitle]);

  return <BranchesDataTable />;
}
export default compose(withDashboardActions)(Branches);
