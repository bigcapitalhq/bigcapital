import { PROFIT_LOSS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';
import { HtmlTableCustomCss } from './constants';

describe('ProfitLossSheet HtmlTableCustomCss', () => {
  it.each([
    PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_COLUMN,
    PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_ROW,
  ])('right-aligns the %s cells and column headers', (key) => {
    expect(HtmlTableCustomCss).toContain(`table td.cell--${key}`);
    expect(HtmlTableCustomCss).toContain(`table .column--${key}`);
  });

  it('right-aligns the per-date-period percentage cells', () => {
    expect(HtmlTableCustomCss).toContain(
      'table td[class*="cell--percentage_"]',
    );
  });
});
