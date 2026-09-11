import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithItemCategoryDetailProps {
  itemCategoryDetail: unknown;
}

export function withItemCategoryDetail<Props = unknown>() {
  const mapStateToProps: MapStateToProps<
    WithItemCategoryDetailProps,
    Props,
    ApplicationState
  > = () => ({
    itemCategoryDetail: undefined,
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithItemCategoryDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithItemCategoryDetailProps>
    >;
  };
}
