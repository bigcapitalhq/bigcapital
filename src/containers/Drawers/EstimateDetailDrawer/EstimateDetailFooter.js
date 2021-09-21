import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine, If } from 'components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import { FormatNumber } from '../../../components';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

/**
 * Estimate details panel footer content.
 */
export default function EstimateDetailFooter() {
  const { estimate } = useEstimateDetailDrawerContext();

  return (
    <div className={clsx(EstimateDetailsCls.detail_panel_footer)}>
      <TotalLines className={clsx(EstimateDetailsCls.total_lines)}>
        <TotalLine
          title={<T id={'estimate.details.subtotal'} />}
          value={<FormatNumber value={estimate.amount} />}
          className={EstimateDetailsCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'estimate.details.total'} />}
          value={estimate.formatted_amount}
          className={EstimateDetailsCls.total_line_total}
        />
      </TotalLines>

      <If condition={false}>
        <div className={clsx(EstimateDetailsCls.detail_panel_note)}>
          <p>
            <b><T id={'estimate.details.note'} />:</b> --
          </p>
        </div>
      </If>
    </div>
  );
}
