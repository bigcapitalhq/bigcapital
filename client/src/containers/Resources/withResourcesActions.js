import {connect} from 'react-redux';
import {
  fetchResourceColumns,
  fetchResourceFields,
} from 'store/resources/resources.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchResourceFields: (resourceSlug) => dispatch(fetchResourceFields({ resourceSlug })),
  requestFetchResourceColumns: (resourceSlug) => dispatch(fetchResourceColumns({ resourceSlug })),
});

export default connect(null, mapDispatchToProps);