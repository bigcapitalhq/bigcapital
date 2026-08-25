import { Classes, Position } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  FieldRequiredHint,
  Col,
  Row,
  FDateInput,
  FTextArea,
  FFormGroup,
} from '@/components';
import { useAutofocus, useDateInputFormatter } from '@/hooks';

/**
 * Parial Unlocking transactions form fields.
 */
export function UnlockingPartialTransactionsFormFields(): React.ReactElement {
  const reasonFieldRef = useAutofocus<HTMLTextAreaElement>();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Row>
        <Col xs={6}>
          {/*------------  Unlocking from date  ----------- */}
          <FFormGroup
            name={'unlockFromDate'}
            label={intl.get('unlocking_partial_transactions.dialog.from_date')}
            labelInfo={<FieldRequiredHint />}
            fastField
          >
            <FDateInput
              name={'unlockFromDate'}
              {...dateInputFormatter}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
              fastField
            />
          </FFormGroup>
        </Col>

        <Col xs={6}>
          {/*------------  Unlocking to date  ----------- */}
          <FFormGroup
            name={'unlockToDate'}
            label={intl.get('unlocking_partial_transactions.dialog.to_date')}
            labelInfo={<FieldRequiredHint />}
            fastField
          >
            <FDateInput
              name={'unlockToDate'}
              {...dateInputFormatter}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ unLocking  reason ----------- */}
      <FFormGroup
        name={'reason'}
        label={intl.get('unlocking_partial_transactions.dialog.reason')}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <FTextArea
          name={'reason'}
          growVertically={true}
          large={true}
          inputRef={(ref: HTMLTextAreaElement | null) => {
            reasonFieldRef.current = ref;
          }}
          fill
          fastField
        />
      </FFormGroup>
    </div>
  );
}
