import * as FF from 'fp-ts/function';
import { useHistory } from 'react-router-dom';
import { usePaymentMadesTableColumns, ActionsMenu } from './components';
import { PaymentMadesEmptyStatus } from './PaymentMadesEmptyStatus';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import type { PaymentMadeTableRow } from './components';
import type { WithPaymentMadeProps } from './withPaymentMade';
import type { WithPaymentMadeActionsProps } from './withPaymentMadeActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.PAYMENT_MADES,
  rowName: 'payment-made',
  identifierColumn: 'payment_number',
  ActionsMenu,
});

interface PaymentMadesTableProps
  extends Pick<
      WithPaymentMadeProps,
      'paymentMadesTableState' | 'paymentMadesSelectedRows'
    >,
    WithPaymentMadeActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

function PaymentMadesTableInner({
  setPaymentMadesTableState,
  setPaymentMadesSelectedRows,
  paymentMadesTableState,
  paymentMadesSelectedRows,
  openAlert,
  openDrawer,
}: PaymentMadesTableProps) {
  const columns = usePaymentMadesTableColumns();

  const {
    paymentMades,
    pagination,
    isEmptyStatus,
    isPaymentsLoading,
    isPaymentsFetching,
    billPaymentSettings,
  } = usePaymentMadesListContext();

  const history = useHistory();

  const handleEditPaymentMade = (paymentMade: PaymentMadeTableRow) => {
    history.push(`/payments-made/${paymentMade.id}/edit`);
  };

  const handleDeletePaymentMade = (paymentMade: PaymentMadeTableRow) => {
    openAlert('payment-made-delete', { paymentMadeId: paymentMade.id });
  };

  const handleViewDetailPaymentMade = ({ id }: PaymentMadeTableRow) => {
    openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, { paymentMadeId: id });
  };

  if (isEmptyStatus) {
    return <PaymentMadesEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={paymentMades}
      total={pagination?.total}
      loading={isPaymentsLoading}
      fetching={isPaymentsFetching}
      compact={billPaymentSettings?.tableSize === 'small'}
      query={paymentMadesTableState}
      setQuery={setPaymentMadesTableState}
      selectedIds={paymentMadesSelectedRows}
      setSelectedIds={setPaymentMadesSelectedRows}
      actions={{
        onEdit: handleEditPaymentMade,
        onDelete: handleDeletePaymentMade,
        onViewDetails: handleViewDetailPaymentMade,
      }}
    />
  );
}

export const PaymentMadesTable = FF.pipe(
  PaymentMadesTableInner,
  withDrawerActions,
  withAlertActions,
  withPaymentMade(({ paymentMadesTableState, paymentMadesSelectedRows }) => ({
    paymentMadesTableState,
    paymentMadesSelectedRows,
  })),
  withPaymentMadeActions,
);
