// @ts-nocheck
import { connect } from 'react-redux';
import { getExpensesCurrentPageFactory } from '@/store/users/users.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      usersList: getExpensesCurrentPageFactory(state, props),
      usersLoading: state.users.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
