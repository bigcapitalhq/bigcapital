import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { ProfitLossSheetExportMenu } from './components';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import { withProfitLoss, WithProfitLossProps } from './withProfitLoss';
import {
  withProfitLossActions,
  WithProfitLossActionsProps,
} from './withProfitLossActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface ProfitLossActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type ProfitLossActionsBarProps = Pick<
  WithProfitLossProps,
  'profitLossDrawerFilter'
> &
  Pick<WithProfitLossActionsProps, 'toggleProfitLossFilterDrawer'> &
  WithDialogActionsProps &
  ProfitLossActionsBarOwnProps;

function ProfitLossActionsBarInner({
  profitLossDrawerFilter,
  toggleProfitLossFilterDrawer: toggleFilterDrawer,
  openDialog,
  numberFormat,
  onNumberFormatSubmit,
}: ProfitLossActionsBarProps) {
  const { sheetRefetch, isLoading } = useProfitLossSheetContext();

  const handleFilterClick = () => {
    toggleFilterDrawer(false);
  };

  const handleRecalcReport = () => {
    sheetRefetch();
  };

  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  const handlePrintBtnClick = () => {
    openDialog(DialogsName.ProfitLossSheetPdfPreview);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />

        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            profitLossDrawerFilter ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          onClick={handleFilterClick}
          active={profitLossDrawerFilter}
        />
        <NavbarDivider />

        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isLoading}
            />
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'format'} />}
            icon={<Icon icon="numbers" width={23} height={16} />}
          />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<ProfitLossSheetExportMenu />}
          interactionKind={PopoverInteractionKind.CLICK}
          placement="bottom-start"
          minimal
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="file-export-16" iconSize={16} />}
            text={<T id={'export'} />}
          />
        </Popover>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const ProfitLossActionsBar = compose(
  withProfitLoss(({ profitLossDrawerFilter }) => ({ profitLossDrawerFilter })),
  withProfitLossActions,
  withDialogActions,
)(ProfitLossActionsBarInner);
