import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useBudgetVsActualContext } from './BudgetVsActualBoot';
import { BudgetVsActualExportMenu } from './components';
import {
  withBudgetVsActual,
  WithBudgetVsActualProps,
} from './withBudgetVsActual';
import {
  withBudgetVsActualActions,
  WithBudgetVsActualActionsProps,
} from './withBudgetVsActualActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { saveInvoke } from '@/utils';

interface BudgetVsActualActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type BudgetVsActualActionsBarProps = Pick<
  WithBudgetVsActualProps,
  'budgetVsActualFilter'
> &
  Pick<WithBudgetVsActualActionsProps, 'toggleBudgetVsActualFilterDrawer'> &
  WithDialogActionsProps &
  BudgetVsActualActionsBarOwnProps;

/**
 * Budget vs actual - actions bar.
 */
function BudgetVsActualActionsBarInner({
  // #withBudgetVsActual
  budgetVsActualFilter,

  // #withBudgetVsActualActions
  toggleBudgetVsActualFilterDrawer: toggleFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}: BudgetVsActualActionsBarProps) {
  const { isLoading, refetchBudgetVsActual } = useBudgetVsActualContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };
  // Handle re-calculate the report button.
  const handleRecalcReport = () => {
    refetchBudgetVsActual();
  };
  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.BudgetVsActualPdfPreview);
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
            !budgetVsActualFilter ? (
              <T id={'customize_report'} />
            ) : (
              <T id={'hide_customizer'} />
            )
          }
          onClick={handleFilterToggleClick}
          active={budgetVsActualFilter}
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

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<BudgetVsActualExportMenu />}
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

export const BudgetVsActualActionsBar = FF.pipe(
  BudgetVsActualActionsBarInner,
  withDialogActions,
  withBudgetVsActualActions,
  withBudgetVsActual(({ budgetVsActualFilter }) => ({
    budgetVsActualFilter,
  })),
);
