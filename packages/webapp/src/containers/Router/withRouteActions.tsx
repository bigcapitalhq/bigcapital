import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';

interface RouteActionsOwnProps {
  location: { pathname: string; search: string };
  history: { push: (loc: { pathname: string; search: string }) => void };
}

export interface WithRouteActionsProps {
  addQuery: (key: string, value: string) => void;
  removeQuery: (key: string) => void;
}

export const mapDispatchToProps = (
  _dispatch: Dispatch,
  props: RouteActionsOwnProps,
): WithRouteActionsProps => {
  return {
    addQuery: (key: string, value: string) => {
      const pathname = props.location.pathname;
      const searchParams = new URLSearchParams(props.location.search);

      searchParams.set(key, value);

      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },

    removeQuery: (key: string) => {
      const pathname = props.location.pathname;
      const searchParams = new URLSearchParams(props.location.search);
      searchParams.delete(key);
      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },
  };
};

export function withRouteActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithRouteActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithRouteActionsProps>
  >;
}
