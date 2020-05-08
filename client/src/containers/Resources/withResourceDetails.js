import {connect} from 'react-redux';
import {
  getResourceColumns,
  getResourceFields,
  getResourceMetadata,
} from 'store/resources/resources.reducer';

export const mapStateToProps = (state, props) => {
  const { resourceName } = props;

  console.log(props, 'XX');

  return {
    resourceFields: getResourceFields(state, resourceName),
    resourceColumns: getResourceColumns(state, resourceName),
    resourceMetadata: getResourceMetadata(state, resourceName),
  };
};

export default connect(mapStateToProps);