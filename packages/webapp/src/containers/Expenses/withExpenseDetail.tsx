import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { getExpenseByIdFactory } from '@/store/expenses/expenses.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithExpenseDetailProps {
  expense: ReturnType<ReturnType<typeof getExpenseByIdFactory>>;
}

interface OwnProps {
  expenseId?: number | string;
}

export const withExpenseDetail = () => {
  const getExpenseById = getExpenseByIdFactory();

  const mapStateToProps: MapStateToProps<
    WithExpenseDetailProps,
    OwnProps,
    ApplicationState
  > = (state, props) => ({
    expense: getExpenseById(state, props),
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithExpenseDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithExpenseDetailProps>
    >;
  };
};
