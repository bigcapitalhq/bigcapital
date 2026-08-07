import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { SaleEstimatesListResponse } from '@bigcapital/sdk-ts';
import {
  FormatDateCell,
  FormattedMessage as T,
  Money,
  Choose,
  Icon,
  If,
  Can,
} from '@/components';
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

export type EstimateTableRow = NonNullable<
  SaleEstimatesListResponse['data']
>[number];

interface EstimateActionsPayload {
  onEdit: (estimate: EstimateTableRow) => void;
  onDeliver: (estimate: EstimateTableRow) => void;
  onReject: (estimate: EstimateTableRow) => void;
  onApprove: (estimate: EstimateTableRow) => void;
  onDelete: (estimate: EstimateTableRow) => void;
  onDrawer: (estimate: EstimateTableRow) => void;
  onConvert: (estimate: EstimateTableRow) => void;
  onViewDetails: (estimate: EstimateTableRow) => void;
  onPrint: (estimate: EstimateTableRow) => void;
  onSendMail: (estimate: EstimateTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: EstimateTableRow };
  payload: EstimateActionsPayload;
}

export const statusAccessor = (row: EstimateTableRow) => (
  <Choose>
    <Choose.When condition={!!row.isApproved}>
      <Tag intent={Intent.SUCCESS} round minimal>
        <T id={'approved'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isRejected}>
      <Tag intent={Intent.DANGER} round minimal>
        <T id={'rejected'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isExpired}>
      <Tag intent={Intent.WARNING} round minimal>
        <T id={'estimate.status.expired'} />
      </Tag>
    </Choose.When>

    <Choose.When condition={!!row.isDelivered}>
      <Tag intent={Intent.SUCCESS} round minimal>
        <T id={'delivered'} />
      </Tag>
    </Choose.When>

    <Choose.Otherwise>
      <Tag round minimal>
        <T id={'draft'} />
      </Tag>
    </Choose.Otherwise>
  </Choose>
);

export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDeliver,
    onReject,
    onApprove,
    onDelete,
    onConvert,
    onViewDetails,
    onPrint,
    onSendMail,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_estimate')}
          onClick={safeCallback(onEdit, original)}
        />
        <If condition={!original.isConvertedToInvoice}>
          <MenuItem
            icon={<Icon icon="convert_to" />}
            text={intl.get('convert_to_invoice')}
            onClick={safeCallback(onConvert, original)}
          />
        </If>

        <If condition={!original.isDelivered}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
        <Choose>
          <Choose.When
            condition={!!(original.isDelivered && original.isApproved)}
          >
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
          <Choose.When
            condition={!!(original.isDelivered && original.isRejected)}
          >
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
          </Choose.When>
          <Choose.When condition={!!original.isDelivered}>
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
        </Choose>
      </Can>
      <Can I={SaleEstimateAction.View} a={AbilitySubject.Estimate}>
        <MenuItem
          icon={<Icon icon={'envelope'} iconSize={16} />}
          text={'Send Mail'}
          onClick={safeCallback(onSendMail, original)}
        />
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, original)}
        />
      </Can>
      <Can I={SaleEstimateAction.Delete} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_estimate')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

function AmountAccessor({ amount, currencyCode }: EstimateTableRow) {
  return <Money amount={amount} currency={currencyCode} />;
}

export function useEstiamtesTableColumns(): DataTableColumn<EstimateTableRow>[] {
  return React.useMemo(
    () =>
      [
        {
          id: 'estimate_date',
          Header: intl.get('estimate_date'),
          accessor: 'formattedEstimateDate',
          width: 140,
          className: 'estimate_date',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'customer',
          Header: intl.get('customer_name'),
          accessor: 'customer.displayName',
          width: 140,
          className: 'customer_id',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'expiration_date',
          Header: intl.get('expiration_date'),
          accessor: 'expirationDate',
          Cell: FormatDateCell,
          width: 140,
          className: 'expiration_date',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'estimate_number',
          Header: intl.get('estimate_number'),
          accessor: (row: EstimateTableRow) =>
            row.estimateNumber ? `${row.estimateNumber}` : null,
          width: 140,
          className: 'estimate_number',
          clickable: true,
          textOverview: true,
        },
        {
          id: 'amount',
          Header: intl.get('amount'),
          accessor: AmountAccessor,
          width: 140,
          align: 'right',
          clickable: true,
          className: clsx(CLASSES.FONT_BOLD),
          money: true,
        },
        {
          id: 'status',
          Header: intl.get('status'),
          accessor: (row: EstimateTableRow) => statusAccessor(row),
          width: 140,
          className: 'status',
          clickable: true,
        },
        {
          id: 'reference_no',
          Header: intl.get('reference_no'),
          accessor: 'reference',
          width: 90,
          className: 'reference',
          clickable: true,
          textOverview: true,
        },
      ] as DataTableColumn<EstimateTableRow>[],
    [],
  );
}
