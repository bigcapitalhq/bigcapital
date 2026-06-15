// @ts-nocheck
import { connect } from 'react-redux';

import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withResourceDetail } from '@/containers/Resources/withResourceDetails';
import { withViewsActions } from '@/containers/Views/withViewsActions';
import { withViewsDetails } from '@/containers/Views/withViewDetails';
import { flow } from 'fp-ts/function';

const mapStateToProps = (state, ownProps) => {
  return {
    resourceName: ownProps.viewId
      ? ownProps.viewMeta.resource?.name
      : ownProps.resourceName,
  };
};

const viewFormConnect = connect(mapStateToProps);

export const ViewFormContainer = flow(
  withResourceDetail(),
  viewFormConnect,
  withViewsDetails,
  withViewsActions,
  withDashboardActions,
);
