// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Classes, ControlGroup } from '@blueprintjs/core';
import {
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';

/**
 * Branch form dialog fields.
 */
function BranchFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Branch Name -----------*/}
      <FFormGroup
        name={'name'}
        label={<T id={'branch.dialog.label.branch_name'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        className={'form-group--branch_name'}
      >
        <FInputGroup name={'name'} />
      </FFormGroup>
      {/*------------ Branch Code -----------*/}
      <FFormGroup
        name={'code'}
        label={<T id={'branch.dialog.label.branch_code'} />}
        inline={true}
        className={'form-group--branch_name'}
      >
        <FInputGroup name={'code'} />
      </FFormGroup>

      {/*------------ Branch Address  -----------*/}
      <FFormGroup
        name={'address'}
        label={intl.get('branch.dialog.label.branch_address')}
        inline={true}
        className={'form-group--branch_address'}
      >
        <FInputGroup
          name={'address'}
          placeholder={intl.get('branch.dialog.label.address_1')}
        />
      </FFormGroup>
      <BranchAddressWrap>
        {/*------------ Branch Address City & Country-----------*/}
        <FFormGroup
          name={'city'}
          inline={true}
          className={'form-group--branch_address'}
        >
          <ControlGroup>
            <FInputGroup
              name={'city'}
              placeholder={intl.get('branch.dialog.label.city')}
            />
            <FInputGroup
              name={'country'}
              placeholder={intl.get('branch.dialog.label.country')}
            />
          </ControlGroup>
        </FFormGroup>
      </BranchAddressWrap>

      {/*------------ Phone Number -----------*/}
      <FFormGroup
        name={'phone_number'}
        label={intl.get('branch.dialog.label.phone_number')}
        inline={true}
        className={'form-group--phone_number'}
      >
        <FInputGroup name={'phone_number'} placeholder={'https://'} />
      </FFormGroup>

      {/*------------ Email -----------*/}
      <FFormGroup
        name={'email'}
        label={intl.get('branch.dialog.label.email')}
        inline={true}
        className={'form-group--email'}
      >
        <FInputGroup name={'email'} />
      </FFormGroup>

      {/*------------ Website -----------*/}
      <FFormGroup
        name={'website'}
        label={intl.get('branch.dialog.label.website')}
        inline={true}
        className={'form-group--website'}
      >
        <FInputGroup name={'website'} />
      </FFormGroup>
    </div>
  );
}

export default BranchFormFields;

const BranchAddressWrap = styled.div`
  margin-left: 160px;
`;
