import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { ComponentType } from 'react';
import {
  fetchView,
  submitView,
  deleteView,
  editView,
  fetchViewResource,
  fetchResourceViews,
} from '@/store/custom-views/custom-views.actions';

export interface WithViewsActionsProps {
  requestFetchView: (id: string | number) => unknown;
  requestSubmitView: (form: unknown) => unknown;
  requestEditView: (id: string | number, form: unknown) => unknown;
  requestDeleteView: (id: string | number) => unknown;
  requestFetchResourceViews: (resourceSlug: string) => unknown;
  requestFetchViewResource: (id: string | number) => unknown;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithViewsActionsProps => ({
  requestFetchView: (id) => dispatch(fetchView({ id })),
  requestSubmitView: (form) => dispatch(submitView({ form })),
  requestEditView: (id, form) => dispatch(editView({ id, form })),
  requestDeleteView: (id) => dispatch(deleteView({ id })),
  requestFetchResourceViews: (resourceSlug) =>
    dispatch(fetchResourceViews({ resourceSlug })),
  requestFetchViewResource: (id) => dispatch(fetchViewResource({ id })),
});

export function withViewsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithViewsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithViewsActionsProps>
  >;
}
