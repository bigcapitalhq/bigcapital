import React from 'react';
import { useEstimateDrawerContext } from './EstimateDrawerProvider';
import PaperTemplate from 'containers/Drawers/PaperTemplate/PaperTemplate';

/**
 *  Estimate paper.
 */
export default function EstimatePaper() {
  const { estimate, entries } = useEstimateDrawerContext();
  return <PaperTemplate paperData={estimate} entries={entries} />;
}
