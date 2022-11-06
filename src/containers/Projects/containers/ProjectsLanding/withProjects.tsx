// @ts-nocheck
import { connect } from 'react-redux';
import {
  getProjectsTableStateFactory,
  isProjectsTableStateChangedFactory,
} from '@/store/Project/projects.selectors';

export default (mapState) => {
  const getProjectsTableState = getProjectsTableStateFactory();
  const isProjectsTableStateChanged = isProjectsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      projectsTableState: getProjectsTableState(state, props),
      projectsTableStateChanged: isProjectsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
