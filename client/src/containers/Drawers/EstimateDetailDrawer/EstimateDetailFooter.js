import React from 'react';
import clsx from 'classnames';

import { TotalLines, TotalLine, If } from 'components';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

/**
 * Estimate details panel footer content.
 */
export default function EstimateDetailFooter() {
  return (
    <div className={clsx(EstimateDetailsCls.detail_panel_footer)}>
      <TotalLines className={clsx(EstimateDetailsCls.total_lines)}>
        <TotalLine
          title={'Subtotal'}
          value={'1000'}
          className={EstimateDetailsCls.total_line_subtotal}
        />
        <TotalLine
          title={'TOTAL'}
          value={'1000'}
          className={EstimateDetailsCls.total_line_total}
        />
        <TotalLine
          title={'Payment made'}
          value={'1000'}
          className={EstimateDetailsCls.total_line_payment}
        />
        <TotalLine
          title={'Due amount'}
          value={'1000'}
          className={EstimateDetailsCls.total_line_dueAmount}
        />
      </TotalLines>

      <If condition={false}>
        <div className={clsx(EstimateDetailsCls.detail_panel_note)}>
          <p>
            <b>Note:</b> --
          </p>
        </div>
      </If>
    </div>
  );
}
