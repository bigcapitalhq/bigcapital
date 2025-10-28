// @ts-nocheck
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';

import { useHistory } from 'react-router-dom';

import {
  If,
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

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { useRefreshPaymentMades } from '@/hooks/query/paymentMades';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';

import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

/**
 * Payment made actions bar.
 */
function PaymentMadeActionsBar({
  // #withPaymentMadesActions
  setPaymentMadesTableState,

  // #withPaymentMades
  paymentMadesFilterConditions,

  // #withSettings
  paymentMadesTableSize,

  // #withDialogActions
  openDialog,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Payment receives list context.
  const { paymentMadesViews, fields } = usePaymentMadesListContext();

  // Payment receive refresh action.
  const { refresh } = useRefreshPaymentMades();

  // Handle new payment made button click.
  const handleClickNewPaymentMade = () => {
    history.push('/payments-made/new');
  };
  // Handle tab changing.
  const handleTabChange = (viewSlug) => {
    setPaymentMadesTableState({ viewSlug });
  };
  // Handle click a refresh payment receives.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('billPayments', 'tableSize', size);
  };
  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/payments-made/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'bill_payment' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'BillPayment' });
  };

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
            onFilterChange: (filterConditions) => {
              setPaymentMadesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentMadesFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            // onClick={handleBulkDelete}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
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
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
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

export default compose(
  withPaymentMadeActions,
  withSettingsActions,
  withPaymentMade(({ paymentMadesTableState }) => ({
    paymentMadesFilterConditions: paymentMadesTableState.filterRoles,
  })),
  withSettings(({ billPaymentSettings }) => ({
    paymentMadesTableSize: billPaymentSettings?.tableSize,
  })),
  withDialogActions,
)(PaymentMadeActionsBar);
