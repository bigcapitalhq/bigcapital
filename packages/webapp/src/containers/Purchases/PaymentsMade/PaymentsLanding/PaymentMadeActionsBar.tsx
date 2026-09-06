import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useBulkDeletePaymentMadesDialog } from './hooks/use-bulk-delete-payment-mades-dialog';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import type { WithPaymentMadeProps } from './withPaymentMade';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  DashboardFilterButton,
  AdvancedFilterPopover,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshPaymentMades } from '@/hooks/query/payment-mades';
import { compose } from '@/utils';

interface WithPaymentMadeActionsProps {
  setPaymentMadesTableState: (state: Record<string, any>) => void;
}

interface PaymentMadeActionsBarProps
  extends Pick<WithPaymentMadeProps, 'paymentMadesSelectedRows'>,
    WithPaymentMadeActionsProps,
    WithDialogActionsProps {
  paymentMadesFilterConditions: any[];
}

function PaymentMadeActionsBarInner({
  setPaymentMadesTableState,
  paymentMadesFilterConditions,
  paymentMadesSelectedRows,
  openDialog,
}: PaymentMadeActionsBarProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();

  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const { paymentMadesViews, fields, billPaymentSettings } =
    usePaymentMadesListContext();
  const paymentMadesTableSize = billPaymentSettings?.tableSize as
    | string
    | undefined;

  const { refresh } = useRefreshPaymentMades();

  const handleClickNewPaymentMade = () => {
    history.push('/payments-made/new');
  };
  const handleTabChange = (viewSlug: string) => {
    setPaymentMadesTableState({ viewSlug });
  };
  const handleRefreshBtnClick = () => {
    refresh();
  };
  const handleTableRowSizeChange = (size: any) => {
    saveSettings({
      options: [{ group: 'billPayments', key: 'tableSize', value: size }],
    });
  };
  const handleImportBtnClick = () => {
    history.push('/payments-made/import');
  };
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'bill_payment' });
  };
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'BillPayment' });
  };

  const { openBulkDeleteDialog, isValidatingBulkDeletePaymentMades } =
    useBulkDeletePaymentMadesDialog();

  if (!isEmpty(paymentMadesSelectedRows)) {
    const handleBulkDelete = () => {
      openBulkDeleteDialog(paymentMadesSelectedRows as number[]);
    };
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeletePaymentMades}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bill_payments'}
          views={paymentMadesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_payment_made'} />}
            onClick={handleClickNewPaymentMade}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: paymentMadesFilterConditions,
            defaultFieldKey: 'payment_number',
            fields: fields,
            onFilterChange: (filterConditions: any) => {
              setPaymentMadesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentMadesFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />

        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={paymentMadesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const PaymentMadeActionsBar = compose(
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState, paymentMadesSelectedRows }) => ({
    paymentMadesFilterConditions: paymentMadesTableState.filterRoles,
    paymentMadesSelectedRows,
  })),
  withDialogActions,
)(PaymentMadeActionsBarInner);
