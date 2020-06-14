import {connect} from 'react-redux';
import {
  getResourceColumns,
  getResourceFields,
  getResourceMetadata,
  getResourceData,
} from 'store/resources/resources.reducer';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const { resourceName } = props;
    const mapped =  {
      resourceData: getResourceData(state, resourceName),
      resourceFields: getResourceFields(state, resourceName),
      resourceColumns: getResourceColumns(state, resourceName),
      resourceMetadata: getResourceMetadata(state, resourceName),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };  
  return connect(mapStateToProps);
};
