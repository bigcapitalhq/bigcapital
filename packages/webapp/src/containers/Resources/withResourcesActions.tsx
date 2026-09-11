import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { ComponentType } from 'react';
import {
  fetchResourceColumns,
  fetchResourceFields,
  fetchResourceData,
} from '@/store/resources/resources.actions';

export interface WithResourcesActionsProps {
  requestFetchResourceFields: (resourceSlug: string) => void;
  requestFetchResourceColumns: (resourceSlug: string) => void;
  requestResourceData: (resourceSlug: string) => void;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithResourcesActionsProps => ({
  requestFetchResourceFields: (resourceSlug: string) =>
    dispatch(fetchResourceFields({ resourceSlug })),
  requestFetchResourceColumns: (resourceSlug: string) =>
    dispatch(fetchResourceColumns({ resourceSlug })),
  requestResourceData: (resourceSlug: string) =>
    dispatch(fetchResourceData({ resourceSlug })),
});

export function withResourcesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithResourcesActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithResourcesActionsProps>
  >;
}
