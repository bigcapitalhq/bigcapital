//@ts-nocheck

import React from 'react';
import moment from 'moment';
import { subtract } from 'lodash';
import { calculateStatus } from '@/utils';
import { useProjectDetailContext } from './ProjectDetailProvider';

function calculateProject(costEstimate, totalAmount) {
  return (costEstimate / totalAmount) * 100;
}

export const useCalculateProject = () => {
  const { project } = useProjectDetailContext();
  const percentageOfInvoice = calculateProject(
    project?.total_invoiced,
    project?.cost_estimate,
  );

  const percentageOfExpense = calculateProject(
    project?.total_expenses,
    project?.cost_estimate,
  );

  return {
    percentageOfInvoice,
    percentageOfExpense,
  };
};

