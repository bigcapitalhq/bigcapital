import * as R from 'ramda';
/**
 * All passed conditions should pass.
 * @param condsPairFilters
 * @returns
 */
export const allPassedConditionsPass = (condsPairFilters: any[]): Function => {
  const filterCallbacks = condsPairFilters
    .filter((cond) => cond[0])
    .map((cond) => cond[1]);

  return R.allPass(filterCallbacks);
};
