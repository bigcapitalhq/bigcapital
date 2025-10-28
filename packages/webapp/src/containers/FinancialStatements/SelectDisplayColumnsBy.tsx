// @ts-nocheck
import React from 'react';
import {
  Row,
  Col,
  FSelect,
  FormattedMessage as T,
  FFormGroup,
} from '@/components';
import { displayColumnsByOptions } from './constants';

/**
 * Financial statement - Display columns by and type select.
 */
export default function SelectsListColumnsBy(props) {
  const { formGroupProps, selectListProps } = props;

  return (
    <Row>
      <Col xs={4}>
        <FFormGroup
          name={'displayColumnsType'}
          label={<T id={'display_report_columns'} />}
          inline={false}
          {...formGroupProps}
        >
          <FSelect
            name={'displayColumnsType'}
            items={displayColumnsByOptions}
            valueAccessor={'key'}
            textAccessor={'name'}
            filterable={false}
            popoverProps={{ minimal: true }}
            {...selectListProps}
          />
        </FFormGroup>
      </Col>
    </Row>
  );
}
