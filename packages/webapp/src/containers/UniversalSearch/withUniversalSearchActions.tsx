// @ts-nocheck
import { connect } from 'react-redux';
import t from '@/store/types';
import {
  universalSearchResetResourceType,
  universalSearchSetResourceType,
  universalSearchSetSelectedItem,
  universalSearchResetSelectedItem,
} from '@/store/search/search.actions';

export const mapDispatchToProps = (dispatch) => ({
  openGlobalSearch: () => dispatch({ type: t.OPEN_SEARCH }),
  closeGlobalSearch: () => dispatch({ type: t.CLOSE_SEARCH }),

  setResourceTypeUniversalSearch: (resourceType) =>
    dispatch(universalSearchSetResourceType(resourceType)),

  resetResourceTypeUniversalSearch: () =>
    dispatch(universalSearchResetResourceType()),

  setSelectedItemUniversalSearch: (resourceType, resourceId) =>
    dispatch(universalSearchSetSelectedItem(resourceType, resourceId)),

  resetSelectedItemUniversalSearch: () =>
    dispatch(universalSearchResetSelectedItem()),
});

export default connect(null, mapDispatchToProps);
