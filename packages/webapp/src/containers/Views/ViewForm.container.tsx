import { connect } from 'react-redux';
import type { ApplicationState } from '@/store/reducers';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withResourceDetails } from '@/containers/Resources/withResourceDetails';
import { withViewDetails } from '@/containers/Views/withViewDetails';
import { withViewsActions } from '@/containers/Views/withViewsActions';
import { compose } from '@/utils';

interface ViewFormContainerOwnProps {
  viewId?: number;
  viewMeta?: { resource?: { name?: string } | null };
  resourceName?: string;
}

const mapStateToProps = (
  state: ApplicationState,
  ownProps: ViewFormContainerOwnProps,
) => {
  return {
    resourceName: ownProps.viewId
      ? ownProps.viewMeta?.resource?.name
      : ownProps.resourceName,
  };
};

const viewFormConnect = connect(mapStateToProps);

export const ViewFormContainer = compose(
  withDashboardActions,
  withViewsActions,
  withViewDetails(),
  viewFormConnect,
  withResourceDetails(),
);
