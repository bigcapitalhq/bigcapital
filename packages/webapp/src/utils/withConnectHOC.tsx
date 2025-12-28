import { ComponentType } from 'react';
import { Dispatch } from 'redux';
import { connect, MapStateToProps } from 'react-redux';

/**
 * Creates a simple dispatch HOC that injects action props into a component.
 * This is the DRY utility for Pattern 1: Action HOCs.
 *
 * @example
 * ```tsx
 * export interface WithAlertActionsProps {
 *   openAlert: (name: string) => void;
 * }
 *
 * export const mapDispatchToProps = (dispatch: Dispatch): WithAlertActionsProps => ({
 *   openAlert: (name) => dispatch({ type: 'OPEN_ALERT', name }),
 * });
 *
 * export const withAlertActions = createActionHOC<WithAlertActionsProps>(mapDispatchToProps);
 * ```
 */
export function createActionHOC<TInjectedProps extends object>(
  mapDispatchToProps: (dispatch: Dispatch) => TInjectedProps,
) {
  return function withHOC<P extends TInjectedProps>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof TInjectedProps>> {
    const Connected = connect(null, mapDispatchToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof TInjectedProps>>;
  };
}

/**
 * Creates a state factory HOC that accepts an optional mapState function.
 * This is the DRY utility for Pattern 2: State Factory HOCs.
 *
 * @example
 * ```tsx
 * export interface WithDrawersProps {
 *   isOpen: boolean;
 *   payload: Record<string, unknown>;
 * }
 *
 * export const withDrawers = createStateFactoryHOC<WithDrawersProps>((state, props) => ({
 *   isOpen: isDrawerOpen(state, props),
 *   payload: getDrawerPayload(state, props),
 * }));
 * ```
 */
export function createStateFactoryHOC<TInjectedProps extends object>(
  createMapState: () => (state: any, props: any) => TInjectedProps,
) {
  type MapStateFn<T> = (mapped: TInjectedProps, state?: unknown, props?: unknown) => T;

  return function withHOC<P, T = TInjectedProps>(mapState?: MapStateFn<T>) {
    const mapStateToProps = createMapState();
    const wrappedMapState = (state: any, props: any) => {
      const mapped = mapStateToProps(state, props);
      return mapState ? mapState(mapped, state, props) : mapped;
    };

    return function <C extends ComponentType<P>>(WrappedComponent: C) {
      return connect(wrappedMapState)(WrappedComponent as ComponentType<any>) as unknown as ComponentType<
        Omit<P, keyof (T extends TInjectedProps ? T : TInjectedProps)>
      >;
    };
  };
}

/**
 * Creates a simple state HOC that directly connects state to component props.
 * This is for HOCs that don't use the factory pattern.
 *
 * @example
 * ```tsx
 * export interface WithCurrencyDetailProps {
 *   currency: Record<string, unknown> | null;
 * }
 *
 * export const withCurrencyDetail = createStateHOC<WithCurrencyDetailProps>((state, props) => ({
 *   currency: getCurrencyByCode(state, props),
 * }));
 * ```
 */
export function createStateHOC<TInjectedProps extends object>(
  mapStateToProps: (state: any, props: any) => TInjectedProps,
) {
  return function withHOC<P extends TInjectedProps>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof TInjectedProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof TInjectedProps>>;
  };
}
