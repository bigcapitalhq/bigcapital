// @ts-nocheck
import styled from 'styled-components';
import { Form } from 'formik';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import {
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FTextArea,
} from '@/components';

/**
 * Preferences estimates form.
 */
export function PreferencesEstimatesForm({ isSubmitting }) {
  const history = useHistory();

  // Handle close click.
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ---------- Terms & Conditions ----------  */}
      <FFormGroup
        name={'termsConditions'}
        label={<T id={'pref.estimates.termsConditions.field'} />}
        labelInfo={<FieldRequiredHint />}
        fastField={true}
      >
        <FTextArea
          medium={'true'}
          name={'termsConditions'}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      {/* ---------- Customer Notes ----------  */}
      <FFormGroup
        name={'customerNotes'}
        label={<T id={'pref.estimates.customerNotes.field'} />}
        fastField={true}
      >
        <FTextArea
          medium={'true'}
          name={'tax_number'}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      <CardFooterActions>
        <Button loading={isSubmitting} intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}

const CardFooterActions = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e0e7ea;
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;
