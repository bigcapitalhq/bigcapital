import {connect} from 'react-redux';
import {
  fetchResourceColumns,
  fetchResourceFields,
} from 'store/resources/resources.actions';
import {
  getResourceColumns,
  getResourceFields,
  getResourceColumn,
  getResourceField,
} from 'store/resources/resources.reducer';

export const mapStateToProps = (state, props) => ({
  getResourceColumns: (resourceSlug) => getResourceColumns(state, resourceSlug),
  getResourceFields: (resourceSlug) => getResourceFields(state, resourceSlug),

  getResourceColumn: (columnId) => getResourceColumn(state, columnId),
  getResourceField: (fieldId) => getResourceField(state, fieldId),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchResourceFields: (resourceSlug) => dispatch(fetchResourceFields({ resourceSlug })),
  fetchResourceColumns: (resourceSlug) => dispatch(fetchResourceColumns({ resourceSlug })),
});

export default connect(mapStateToProps, mapDispatchToProps);