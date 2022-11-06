// @ts-nocheck
import {connect} from 'react-redux';
import {compose} from '@/utils';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withResourceDetail from '@/containers/Resources/withResourceDetails';
import withViewsActions from '@/containers/Views/withViewsActions';
import withViewsDetails from '@/containers/Views/withViewDetails';

const mapStateToProps = (state, ownProps) => {
  return {
    resourceName: ownProps.viewId ?
      ownProps.viewMeta.resource?.name : ownProps.resourceName,
  };
};

const viewFormConnect = connect(mapStateToProps);

export default compose(
  withDashboardActions,
  withViewsActions,
  withViewsDetails,
  viewFormConnect,
  withResourceDetail(),
);