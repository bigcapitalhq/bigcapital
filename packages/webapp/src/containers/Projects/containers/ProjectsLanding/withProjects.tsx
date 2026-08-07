import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getProjectsTableStateFactory,
  isProjectsTableStateChangedFactory,
} from '@/store/project/projects.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithProjectsProps {
  projectsTableState: ReturnType<
    ReturnType<typeof getProjectsTableStateFactory>
  >;
  projectsTableStateChanged: ReturnType<
    ReturnType<typeof isProjectsTableStateChangedFactory>
  >;
}

export const withProjects = <Props extends { location?: { search: string } }>(
  mapState?: MapState<WithProjectsProps, Props>,
) => {
  const getProjectsTableState = getProjectsTableStateFactory();
  const isProjectsTableStateChanged = isProjectsTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithProjectsProps = {
      projectsTableState: getProjectsTableState(state, props),
      projectsTableStateChanged: isProjectsTableStateChanged(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
