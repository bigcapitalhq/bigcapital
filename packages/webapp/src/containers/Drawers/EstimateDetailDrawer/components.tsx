// @ts-nocheck
import {
  Intent,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Tag,
  MenuDivider,
  Classes,
} from '@blueprintjs/core';
import * as R from 'ramda';

import { Icon, T, Choose, Can } from '@/components';
import { AbilitySubject, SaleEstimateAction } from '@/constants/abilityOption';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

/**
 * Estimate details status.
 * @return {React.JSX}
 */
export function EstimateDetailsStatus({ estimate }) {
  return (
    <Choose>
      <Choose.When condition={estimate.is_approved}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'approved'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_rejected}>
        <Tag intent={Intent.DANGER} round={true}>
          <T id={'rejected'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_expired}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'estimate.status.expired'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={estimate.is_delivered}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'delivered'} />
        </Tag>
      </Choose.When>
      <Choose.Otherwise>
        <Tag round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

export const EstimateMoreMenuItems = R.compose(withAlertsActions)(
  ({
    // # withAlertsActions,
    openAlert,

    // # rest
    payload: { onNotifyViaSMS },
  }) => {
    const { estimateId, estimate } = useEstimateDetailDrawerContext();

    // Handle cancel/confirm estimate approve.
    const handleApproveEstimate = () => {
      openAlert('estimate-Approve', { estimateId });
    };
    // Handle cancel/confirm estimate reject.
    const handleRejectEstimate = () => {
      openAlert('estimate-reject', { estimateId });
    };

    return (
      <Popover
        minimal={true}
        content={
          <Menu>
            <MenuItem
              onClick={onNotifyViaSMS}
              text={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
            />
            <MenuDivider />
            <Choose>
              <Choose.When
                condition={estimate.is_delivered && estimate.is_rejected}
              >
                <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
                  <MenuItem
                    className={Classes.MINIMAL}
                    text={<T id={'mark_as_approved'} />}
                    onClick={handleApproveEstimate}
                  />
                </Can>
              </Choose.When>
              <Choose.When
                condition={estimate.is_delivered && estimate.is_approved}
              >
                <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
                  <MenuItem
                    className={Classes.MINIMAL}
                    text={<T id={'mark_as_rejected'} />}
                    onClick={handleRejectEstimate}
                  />
                </Can>
              </Choose.When>
              <Choose.When condition={estimate.is_delivered}>
                <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
                  <MenuItem
                    className={Classes.MINIMAL}
                    text={<T id={'mark_as_approved'} />}
                    onClick={handleApproveEstimate}
                  />
                </Can>
                <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
                  <MenuItem
                    className={Classes.MINIMAL}
                    text={<T id={'mark_as_rejected'} />}
                    onClick={handleRejectEstimate}
                  />
                </Can>
              </Choose.When>
            </Choose>
          </Menu>
        }
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.BOTTOM_LEFT}
        modifiers={{
          offset: { offset: '0, 4' },
        }}
      >
        <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
      </Popover>
    );
  },
);
