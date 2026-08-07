import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getEstimatesTableStateFactory,
  isEstimatesTableStateChangedFactory,
  getEstimatesSelectedRowsFactory,
} from '@/store/estimate/estimates.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithEstimatesProps {
  estimatesTableState: ReturnType<
    ReturnType<typeof getEstimatesTableStateFactory>
  >;
  estimatesTableStateChanged: ReturnType<
    ReturnType<typeof isEstimatesTableStateChangedFactory>
  >;
  estimatesSelectedRows: ReturnType<
    ReturnType<typeof getEstimatesSelectedRowsFactory>
  >;
}

export const withEstimates = <Props extends { location?: { search: string } }>(
  mapState?: MapState<WithEstimatesProps, Props>,
) => {
  const getEstimatesTableState = getEstimatesTableStateFactory();
  const getSelectedRows = getEstimatesSelectedRowsFactory();
  const isEstimatesTableStateChanged = isEstimatesTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithEstimatesProps = {
      estimatesTableState: getEstimatesTableState(state, props),
      estimatesTableStateChanged: isEstimatesTableStateChanged(state),
      estimatesSelectedRows: getSelectedRows(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
