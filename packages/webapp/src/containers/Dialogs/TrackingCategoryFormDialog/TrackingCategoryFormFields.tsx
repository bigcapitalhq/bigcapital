import {
  Button,
  Checkbox,
  Classes,
  FormGroup,
  Icon,
  Intent,
  Position,
  Tag,
} from '@blueprintjs/core';
import { FieldArray, useFormikContext, type ArrayHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { TrackingCategoryFormValues } from './types';
import {
  FieldRequiredHint,
  FCheckbox,
  FFormGroup,
  FInputGroup,
  FSwitch,
  FTextArea,
  Hint,
} from '@/components';
import {
  TRACKING_CATEGORY_MODULE_LABELS,
  TRACKING_CATEGORY_MODULES,
} from '@/constants';

/**
 * Tracking category form fields.
 */
export function TrackingCategoryFormFields(): React.ReactElement {
  const { values } = useFormikContext<TrackingCategoryFormValues>();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FFormGroup
        name={'name'}
        label={intl.get('tracking_categories.field.name')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
      >
        <FInputGroup
          name={'name'}
          placeholder={intl.get('tracking_categories.field.name_placeholder')}
        />
      </FFormGroup>

      <FFormGroup
        name={'description'}
        label={intl.get('tracking_categories.field.description')}
        inline={true}
      >
        <FTextArea
          name={'description'}
          fill={true}
          placeholder={intl.get(
            'tracking_categories.field.description_placeholder',
          )}
        />
      </FFormGroup>

      <FFormGroup
        name={'modules'}
        label={intl.get('tracking_categories.field.modules')}
        labelInfo={
          <Hint
            content={intl.get('tracking_categories.field.modules_hint')}
            position={Position.RIGHT}
          />
        }
        inline={true}
      >
        <ModulesField />
      </FFormGroup>

      <FormGroup
        label={intl.get('tracking_categories.field.options')}
        labelInfo={
          <Hint
            content={intl.get('tracking_categories.field.options_hint')}
            position={Position.RIGHT}
          />
        }
        inline={true}
      >
        <OptionsFieldArray options={values.options} />
      </FormGroup>
    </div>
  );
}

/**
 * Modules (Sale Invoice, Estimate, Manual Journal) checkbox group.
 */
function ModulesField() {
  const { values, setFieldValue } =
    useFormikContext<TrackingCategoryFormValues>();

  const selectedModules = values.modules ?? [];
  const allSelected = TRACKING_CATEGORY_MODULES.every((module) =>
    selectedModules.includes(module),
  );
  const someSelected = selectedModules.length > 0;

  // Handles changing the "All" checkbox.
  const handleAllChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFieldValue(
      'modules',
      event.currentTarget.checked ? [...TRACKING_CATEGORY_MODULES] : [],
    );
  };

  return (
    <ModulesCheckboxes>
      {TRACKING_CATEGORY_MODULES.map((module) => (
        <FCheckbox
          key={module}
          name={'modules'}
          value={module}
          label={intl.get(TRACKING_CATEGORY_MODULE_LABELS[module])}
        />
      ))}

      <Checkbox
        checked={allSelected}
        indeterminate={!allSelected && someSelected}
        onChange={handleAllChange}
        label={intl.get('tracking_categories.module.all')}
      />
    </ModulesCheckboxes>
  );
}

interface OptionsFieldArrayProps {
  options: TrackingCategoryFormValues['options'];
}

/**
 * Dynamic options editor.
 */
function OptionsFieldArray({ options }: OptionsFieldArrayProps) {
  return (
    <FieldArray
      name={'options'}
      render={(arrayHelpers: ArrayHelpers) => (
        <OptionsList>
          {options.map((option, index) => (
            <OptionRow key={option.id ?? `new-option-${index}`}>
              <OptionName>
                <FInputGroup
                  name={`options.${index}.name`}
                  placeholder={intl.get(
                    'tracking_categories.field.option_name_placeholder',
                  )}
                  fill={true}
                />
              </OptionName>

              <OptionActive>
                <FSwitch
                  name={`options.${index}.active`}
                  label={intl.get('tracking_categories.field.option_active')}
                />
                {!option.active && (
                  <Tag minimal={true}>
                    {intl.get('tracking_categories.status.archived')}
                  </Tag>
                )}
              </OptionActive>

              <Button
                minimal={true}
                icon={<Icon icon="trash" iconSize={16} />}
                intent={Intent.DANGER}
                onClick={() => arrayHelpers.remove(index)}
                aria-label={intl.get(
                  'tracking_categories.action.remove_option',
                )}
              />
            </OptionRow>
          ))}

          <Button
            minimal={true}
            icon={<Icon icon="plus" iconSize={12} />}
            onClick={() => arrayHelpers.push({ name: '', active: true })}
          >
            {intl.get('tracking_categories.action.add_option')}
          </Button>
        </OptionsList>
      )}
    />
  );
}

const ModulesCheckboxes = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  .bp4-control {
    margin-bottom: 0;
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionName = styled.div`
  flex: 1;
`;

const OptionActive = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 150px;

  .bp4-control {
    margin-bottom: 0;
  }
`;
