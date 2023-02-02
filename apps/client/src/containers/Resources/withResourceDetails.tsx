// @ts-nocheck
import {connect} from 'react-redux';
import {
  getResourceColumns,
  getResourceMetadata,
  getResourceFieldsFactory,
  getResourceDataFactory,
} from '@/store/resources/resources.selectors';

export default (mapState) => {
  const getResourceFields = getResourceFieldsFactory();
  const getResourceData = getResourceDataFactory();

  const mapStateToProps = (state, props) => {
    const { resourceName } = props;

    const mapped =  {
      resourceData: getResourceData(state, props),
      resourceFields: getResourceFields(state, props),
      resourceColumns: getResourceColumns(state, resourceName),
      resourceMetadata: getResourceMetadata(state, resourceName),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };  
  return connect(mapStateToProps);
};
