// @ts-nocheck
import { connect } from 'react-redux';

export const withUniversalSearch = (mapState) => {
  const mapStateToProps = (state, props) => {
    const { globalSearch } = state;

    const mapped = {
      globalSearchShow: globalSearch.isOpen,
      defaultUniversalResourceType: globalSearch.defaultResourceType,

      searchSelectedResourceType: globalSearch.selectedItem.resourceType,
      searchSelectedResourceId: globalSearch.selectedItem.resourceId,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
