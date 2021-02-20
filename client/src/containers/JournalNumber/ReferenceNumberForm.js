import React, { useMemo  } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Row, Col, ErrorMessage } from 'components';
import { FormattedMessage as T } from 'react-intl';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';

/**
 * Reference number form.
 */
export default function ReferenceNumberForm({
  onSubmit,
  onClose,
  initialPrefix,
  initialNumber,
}) {
  const validationSchema = Yup.object().shape({
    number_prefix: Yup.string(),
    next_number: Yup.number(),
  });

  const initialValues = useMemo(
    () => ({
      number_prefix: initialPrefix || '',
      next_number: initialNumber || '',
    }),
    [initialPrefix, initialNumber],
  );

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      onSubmit(values, { setSubmitting, setErrors });
    },
  });
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <p className="paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt porta quam,
          </p>
          <Row>
            {/* prefix */}
            <Col>
            
              <FormGroup
                label={<T id={'prefix'} />}
                className={'form-group--'}
                intent={errors.number_prefix && touched.number_prefix && Intent.DANGER}
                helperText={
                  <ErrorMessage name={'prefix'} {...{ errors, touched }} />
                }
              >
                <InputGroup
                  intent={errors.number_prefix && touched.number_prefix && Intent.DANGER}
                  {...getFieldProps('number_prefix')}
                />
              </FormGroup>
            </Col>
            {/* next_number */}
            <Col>
              <FormGroup
                label={<T id={'next_number'} />}
                className={'form-group--'}
                intent={
                  errors.next_number && touched.next_number && Intent.DANGER
                }
                helperText={
                  <ErrorMessage name={'next_number'} {...{ errors, touched }} />
                }
              >
                <InputGroup
                  intent={
                    errors.next_number && touched.next_number && Intent.DANGER
                  }
                  {...getFieldProps('next_number')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={onClose}>
              <T id={'cancel'} />
            </Button>
            <Button
              intent={Intent.PRIMARY}
              type="submit"
              disabled={isSubmitting}
            >
              <T id={'submit'} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}