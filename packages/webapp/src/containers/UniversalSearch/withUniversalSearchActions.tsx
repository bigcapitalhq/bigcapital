import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import {
  universalSearchResetResourceType,
  universalSearchSetResourceType,
  universalSearchSetSelectedItem,
  universalSearchResetSelectedItem,
} from '@/store/search/search.actions';
import { CLOSE_SEARCH, OPEN_SEARCH } from '@/store/types';

export interface WithUniversalSearchActionsProps {
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  setResourceTypeUniversalSearch: (resourceType: string) => void;
  resetResourceTypeUniversalSearch: () => void;
  setSelectedItemUniversalSearch: (
    resourceType: string,
    resourceId: number | string,
  ) => void;
  resetSelectedItemUniversalSearch: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithUniversalSearchActionsProps => ({
  openGlobalSearch: () => dispatch({ type: OPEN_SEARCH }),
  closeGlobalSearch: () => dispatch({ type: CLOSE_SEARCH }),

  setResourceTypeUniversalSearch: (resourceType: string) =>
    dispatch(universalSearchSetResourceType(resourceType)),

  resetResourceTypeUniversalSearch: () =>
    dispatch(universalSearchResetResourceType()),

  setSelectedItemUniversalSearch: (
    resourceType: string,
    resourceId: number | string,
  ) => dispatch(universalSearchSetSelectedItem(resourceType, resourceId)),

  resetSelectedItemUniversalSearch: () =>
    dispatch(universalSearchResetSelectedItem()),
});

export function withUniversalSearchActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithUniversalSearchActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithUniversalSearchActionsProps>
  >;
}
