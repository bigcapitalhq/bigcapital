import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';

export interface WithUniversalSearchProps {
  globalSearchShow: boolean;
  defaultUniversalResourceType: string;
  searchSelectedResourceType: unknown;
  searchSelectedResourceId: unknown;
}

export const withUniversalSearch = <Props,>(
  mapState?: MapState<WithUniversalSearchProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const { globalSearch } = state;

    const mapped: WithUniversalSearchProps = {
      globalSearchShow: globalSearch.isOpen,
      defaultUniversalResourceType: globalSearch.defaultResourceType,

      searchSelectedResourceType: globalSearch.selectedItem.resourceType,
      searchSelectedResourceId: globalSearch.selectedItem.resourceId,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
