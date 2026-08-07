import { NavbarGroup, NavbarDivider, Button, Classes } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import {
  DashboardActionsBar,
  FormattedMessage as T,
  Can,
  Icon,
} from '@/components';
import { AbilitySubject, TaxRateAction } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Tax rates actions bar.
 */
function TaxRatesActionsBar({
  openDialog,
}: Pick<WithDialogActionsProps, 'openDialog'>) {
  const history = useHistory();

  // Handle `new item` button click.
  const onClickNewItem = () => {
    openDialog(DialogsName.TaxRateForm);
  };

  const handleImportBtnClick = () => {
    history.push('/tax-rates/import');
  };

  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'tax_rate' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={TaxRateAction.Create} a={AbilitySubject.TaxRate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={'New Tax Rate'}
            onClick={onClickNewItem}
          />
        </Can>
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const TaxRatesLandingActionsBar =
  compose(withDialogActions)(TaxRatesActionsBar);
