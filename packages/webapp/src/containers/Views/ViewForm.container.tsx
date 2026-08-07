// @ts-nocheck
import { connect } from 'react-redux';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withResourceDetail } from '@/containers/Resources/withResourceDetails';
import { withViewsDetails } from '@/containers/Views/withViewDetails';
import { withViewsActions } from '@/containers/Views/withViewsActions';
import { compose } from '@/utils';

const mapStateToProps = (state, ownProps) => {
  return {
    resourceName: ownProps.viewId
      ? ownProps.viewMeta.resource?.name
      : ownProps.resourceName,
  };
};

const viewFormConnect = connect(mapStateToProps);

export const ViewFormContainer = compose(
  withDashboardActions,
  withViewsActions,
  withViewsDetails,
  viewFormConnect,
  withResourceDetail(),
);
