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
import {
  useEstimateDetailDrawerContext,
  EstimateDetail,
} from './EstimateDetailDrawerProvider';
import { Icon, T, Choose, Can } from '@/components';
import { AbilitySubject, SaleEstimateAction } from '@/constants/abilityOption';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';

interface EstimateDetailsStatusProps {
  estimate: Pick<
    EstimateDetail,
    'isApproved' | 'isRejected' | 'isExpired' | 'isDelivered'
  >;
}

/**
 * Estimate details status.
 */
export function EstimateDetailsStatus({
  estimate,
}: EstimateDetailsStatusProps) {
  return (
    <Choose>
      <Choose.When condition={!!estimate.isApproved}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'approved'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={!!estimate.isRejected}>
        <Tag intent={Intent.DANGER} round={true}>
          <T id={'rejected'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={!!estimate.isExpired}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'estimate.status.expired'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={!!estimate.isDelivered}>
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

interface EstimateMoreMenuItemsInnerProps extends WithAlertActionsProps {
  payload: { onNotifyViaSMS: () => void };
}

function EstimateMoreMenuItemsInner({
  // # withAlertActions,
  openAlert,

  // # rest
  payload: { onNotifyViaSMS },
}: EstimateMoreMenuItemsInnerProps) {
  const { estimateId, estimate } = useEstimateDetailDrawerContext();

  if (!estimate) {
    return null;
  }

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
              condition={!!estimate.isDelivered && !!estimate.isRejected}
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
              condition={!!estimate.isDelivered && !!estimate.isApproved}
            >
              <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
                <MenuItem
                  className={Classes.MINIMAL}
                  text={<T id={'mark_as_rejected'} />}
                  onClick={handleRejectEstimate}
                />
              </Can>
            </Choose.When>
            <Choose.When condition={!!estimate.isDelivered}>
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
}

export const EstimateMoreMenuItems = withAlertActions(
  EstimateMoreMenuItemsInner,
);
