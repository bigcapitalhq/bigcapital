import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getInvoicesTableStateFactory,
  isInvoicesTableStateChangedFactory,
  getInvoicesSelectedRowsFactory,
} from '@/store/invoice/invoices.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithInvoicesProps {
  invoicesTableState: ReturnType<
    ReturnType<typeof getInvoicesTableStateFactory>
  >;
  invoicesTableStateChanged: ReturnType<
    ReturnType<typeof isInvoicesTableStateChangedFactory>
  >;
  invoicesSelectedRows: ReturnType<
    ReturnType<typeof getInvoicesSelectedRowsFactory>
  >;
}

export const withInvoices = <Props extends { location?: { search: string } }>(
  mapState?: MapState<WithInvoicesProps, Props>,
) => {
  const getInvoicesTableState = getInvoicesTableStateFactory();
  const isInvoicesTableStateChanged = isInvoicesTableStateChangedFactory();
  const getSelectedRows = getInvoicesSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithInvoicesProps = {
      invoicesTableState: getInvoicesTableState(state, props),
      invoicesTableStateChanged: isInvoicesTableStateChanged(state),
      invoicesSelectedRows: getSelectedRows(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
