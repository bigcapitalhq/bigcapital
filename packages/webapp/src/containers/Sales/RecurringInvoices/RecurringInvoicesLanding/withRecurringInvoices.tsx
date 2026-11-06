import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getRecurringInvoicesTableStateFactory,
  isRecurringInvoicesTableStateChangedFactory,
  getRecurringInvoicesSelectedRowsFactory,
} from '@/store/recurring-invoices/recurring-invoices.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithRecurringInvoicesProps {
  recurringInvoicesTableState: ReturnType<
    ReturnType<typeof getRecurringInvoicesTableStateFactory>
  >;
  recurringInvoicesTableStateChanged: ReturnType<
    ReturnType<typeof isRecurringInvoicesTableStateChangedFactory>
  >;
  recurringInvoicesSelectedRows: ReturnType<
    ReturnType<typeof getRecurringInvoicesSelectedRowsFactory>
  >;
}

export const withRecurringInvoices = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithRecurringInvoicesProps,
>(
  mapState?: MapState<WithRecurringInvoicesProps, Props, Mapped>,
) => {
  const getRecurringInvoicesTableState =
    getRecurringInvoicesTableStateFactory();
  const isRecurringInvoicesTableStateChanged =
    isRecurringInvoicesTableStateChangedFactory();
  const getSelectedRows = getRecurringInvoicesSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithRecurringInvoicesProps = {
      recurringInvoicesTableState: getRecurringInvoicesTableState(state, props),
      recurringInvoicesTableStateChanged:
        isRecurringInvoicesTableStateChanged(state),
      recurringInvoicesSelectedRows: getSelectedRows(state),
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
