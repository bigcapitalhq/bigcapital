// @ts-nocheck
import React from 'react';
import { FormGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
import { Row, Col, ListSelect, FormattedMessage as T } from '@/components';
import { displayColumnsByOptions } from './constants';

/**
 * Financial statement - Display columns by and type select.
 */
export default function SelectsListColumnsBy(props) {
  const { formGroupProps, selectListProps } = props;

  return (
    <Row>
      <Col xs={4}>
        <FastField name={'displayColumnsType'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'display_report_columns'} />}
              className="form-group-display-columns-by form-group--select-list bp4-fill"
              inline={false}
              {...formGroupProps}
            >
              <ListSelect
                items={displayColumnsByOptions}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'key'}
                textProp={'name'}
                onItemSelect={(item) => {
                  form.setFieldValue('displayColumnsType', item.key);
                }}
                popoverProps={{ minimal: true }}
                {...selectListProps}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>
    </Row>
  );
}
