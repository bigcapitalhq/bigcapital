// @ts-nocheck
import {connect} from 'react-redux';
import {
  fetchResourceColumns,
  fetchResourceFields,
  fetchResourceData,
} from '@/store/resources/resources.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestFetchResourceFields: (resourceSlug) => dispatch(fetchResourceFields({ resourceSlug })),
  requestFetchResourceColumns: (resourceSlug) => dispatch(fetchResourceColumns({ resourceSlug })),
  requestResourceData: (resourceSlug) => dispatch(fetchResourceData({ resourceSlug })),
});

export default connect(null, mapDispatchToProps);