import React, { useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { If, DashboardActionViewsList } from 'components';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withEstimatesActions from './withEstimatesActions';
import { useEstimatesListContext } from './EstimatesListProvider';

import { compose } from 'utils';

/**
 * Estimates list actions bar.
 */
function EstimateActionsBar({
  // #withEstimateActions
  setEstimatesTableState,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [filterCount, setFilterCount] = useState(0);

  // Estimates list context.
  const { estimatesViews } = useEstimatesListContext();

  // Handle click a new sale estimate.
  const onClickNewEstimate = () => {
    history.push('/estimates/new');
  };

  const handleTabChange = (customView) => {
    setEstimatesTableState({
      customViewId: customView.id || null,
    });
  };

  return (
    <DashboardActionsBar> 
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'estimates'}
          views={estimatesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_estimate'} />}
          onClick={onClickNewEstimate}
        />
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
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
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withEstimatesActions,
)(EstimateActionsBar);
