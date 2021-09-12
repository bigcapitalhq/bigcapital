import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine, If } from 'components';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

/**
 * Estimate details panel footer content.
 */
export default function EstimateDetailFooter() {
  return (
    <div className={clsx(EstimateDetailsCls.detail_panel_footer)}>
      <TotalLines className={clsx(EstimateDetailsCls.total_lines)}>
        <TotalLine
          title={<T id={'estimate.details.subtotal'} />}
          value={'1000'}
          className={EstimateDetailsCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'estimate.details.total'} />}
          value={'1000'}
          className={EstimateDetailsCls.total_line_total}
        />
        <TotalLine
          title={<T id={'estimate.details.payment_made'} />}
          value={'1000'}
          className={EstimateDetailsCls.total_line_payment}
        />
        <TotalLine
          title={<T id={'estimate.details.due_amount'} />}
          value={'1000'}
          className={EstimateDetailsCls.total_line_dueAmount}
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
