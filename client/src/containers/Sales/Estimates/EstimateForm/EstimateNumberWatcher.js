import { useEffect } from 'react';
import { useFormikContext } from 'formik';

import withEstimates from './withEstimates';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withEstimateActions from './withEstimateActions';
import { compose } from 'utils';

function EstimateNumberWatcher({
  estimateNumberChanged,

  // #WithEstimateActions
  setEstimateNumberChanged,

  // #withDashboardActions
  changePageSubtitle,

  // #ownProps
  estimateNumber,
}) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (estimateNumberChanged) {
      setFieldValue('estimate_number', estimateNumber);
      changePageSubtitle(`No. ${estimateNumber}`);
      setEstimateNumberChanged(false);
    }
  }, [
    estimateNumber,
    estimateNumberChanged,
    setEstimateNumberChanged,
    setFieldValue,
    changePageSubtitle,
  ]);
  return null;
}


export default compose(
  withEstimates(({ estimateNumberChanged }) => ({
    estimateNumberChanged,
  })),
  withEstimateActions,
  withDashboardActions
)(EstimateNumberWatcher)