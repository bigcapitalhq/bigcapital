interface ComparisonQuery {
  previousPeriod: boolean;
  previousPeriodAmountChange: boolean;
  previousPeriodPercentageChange: boolean;
  previousYear: boolean;
  previousYearAmountChange: boolean;
  previousYearPercentageChange: boolean;
}

export function normalizeComparisonQuery<T extends ComparisonQuery>(query: T) {
  const previousPeriodAmountChange =
    query.previousPeriodPercentageChange || query.previousPeriodAmountChange;
  const previousYearAmountChange =
    query.previousYearPercentageChange || query.previousYearAmountChange;

  return {
    ...query,
    previousPeriodAmountChange,
    previousPeriod: previousPeriodAmountChange || query.previousPeriod,
    previousYearAmountChange,
    previousYear: previousYearAmountChange || query.previousYear,
  };
}
