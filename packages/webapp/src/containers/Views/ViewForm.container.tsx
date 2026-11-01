import * as FF from 'fp-ts/function';
import { connect } from 'react-redux';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withResourceDetails } from '@/containers/Resources/withResourceDetails';
import { withViewDetails } from '@/containers/Views/withViewDetails';
import { withViewsActions } from '@/containers/Views/withViewsActions';

interface ViewFormOwnProps {
  viewId?: string | number;
  viewMeta?: { resource?: { name?: string } } | null;
  resourceName?: string;
}

const mapStateToProps = (
  _state: ApplicationState,
  ownProps: ViewFormOwnProps,
) => {
  return {
    resourceName: ownProps.viewId
      ? ownProps.viewMeta?.resource?.name
      : ownProps.resourceName,
  };
};

function withViewFormResourceName<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> {
  const Connected = connect(mapStateToProps)(
    WrappedComponent as ComponentType<any>,
  );
  return Connected as unknown as ComponentType<P>;
}

export const ViewFormContainer = FF.flow(
  withResourceDetails(),
  withViewFormResourceName,
  withViewDetails(),
  withViewsActions,
  withDashboardActions,
);
