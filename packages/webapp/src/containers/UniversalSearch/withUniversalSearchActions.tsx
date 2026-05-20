// @ts-nocheck
import { connect } from 'react-redux';
import { CLOSE_SEARCH, OPEN_SEARCH } from '@/store/types';;
import {
  universalSearchResetResourceType,
  universalSearchSetResourceType,
  universalSearchSetSelectedItem,
  universalSearchResetSelectedItem,
} from '@/store/search/search.actions';

export const mapDispatchToProps = (dispatch) => ({
  openGlobalSearch: () => dispatch({ type: OPEN_SEARCH }),
  closeGlobalSearch: () => dispatch({ type: CLOSE_SEARCH }),

  setResourceTypeUniversalSearch: (resourceType) =>
    dispatch(universalSearchSetResourceType(resourceType)),

  resetResourceTypeUniversalSearch: () =>
    dispatch(universalSearchResetResourceType()),

  setSelectedItemUniversalSearch: (resourceType, resourceId) =>
    dispatch(universalSearchSetSelectedItem(resourceType, resourceId)),

  resetSelectedItemUniversalSearch: () =>
    dispatch(universalSearchResetSelectedItem()),
});

export const withUniversalSearchActions = connect(null, mapDispatchToProps);
