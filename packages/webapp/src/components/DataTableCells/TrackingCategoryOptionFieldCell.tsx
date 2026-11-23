// @ts-nocheck
import { Classes, FormGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import { TrackingCategoryOptionSuggestField } from '../TrackingCategories';
import { CellType } from '@/constants';

/**
 * Tracking category option cell.
 */
export default function TrackingCategoryOptionFieldCell({
  column,
  row: { index, original },
  payload: { updateData },
}) {
  const category = column.trackingCategory;
  const assignments = original?.trackingCategories ?? [];
  const currentAssignment = assignments.find(
    (assignment) => assignment.categoryId === category.id,
  );
  const selectedOptionId = currentAssignment?.optionId;
  const isArchived = !category.active;

  // Active options are always selectable; an already selected archived option
  // stays visible so historical assignments are preserved.
  const options = (category.options ?? []).filter(
    (option) => !!option.active || option.id === selectedOptionId,
  );

  const updateAssignments = (nextAssignments) => {
    updateData(index, 'trackingCategories', nextAssignments);
  };

  const handleOptionSelect = (option) => {
    updateAssignments(
      assignments
        .filter((assignment) => assignment.categoryId !== category.id)
        .concat({ categoryId: category.id, optionId: option.id }),
    );
  };

  const handleClear = () => {
    updateAssignments(
      assignments.filter((assignment) => assignment.categoryId !== category.id),
    );
  };

  const placeholder = options.length
    ? intl.get('tracking_categories.select_option')
    : intl.get('tracking_categories.no_options');

  return (
    <FormGroup className={classNames('form-group--select-list', Classes.FILL)}>
      <TrackingCategoryOptionSuggestField
        options={options}
        selectedOptionId={selectedOptionId}
        disabled={isArchived || options.length === 0}
        placeholder={placeholder}
        onOptionSelect={handleOptionSelect}
        onClear={handleClear}
      />
    </FormGroup>
  );
}

TrackingCategoryOptionFieldCell.cellType = CellType.Field;
