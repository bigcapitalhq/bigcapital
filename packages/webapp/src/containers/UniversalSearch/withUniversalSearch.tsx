import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithUniversalSearchProps {
  globalSearchShow: boolean;
  defaultUniversalResourceType: string;
  searchSelectedResourceType: unknown;
  searchSelectedResourceId: unknown;
}

export const withUniversalSearch = <
  Props,
  Mapped extends object = WithUniversalSearchProps,
>(
  mapState?: MapState<WithUniversalSearchProps, Props, Mapped>,
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

  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
