import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';
import { getExpensesCurrentPageFactory } from '@/store/users/users.selectors';

export interface WithUsersProps {
  usersList: ReturnType<typeof getExpensesCurrentPageFactory>;
  usersLoading: boolean;
}

export const withUsers = <Props, Mapped extends object = WithUsersProps>(
  mapState?: MapState<WithUsersProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithUsersProps = {
      usersList: getExpensesCurrentPageFactory(state),
      usersLoading: state.users.loading,
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
