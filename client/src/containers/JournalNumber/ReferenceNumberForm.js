import React, { useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { ErrorMessage, AppToaster } from 'components';

import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import { compose, optionsMapToArray } from 'utils';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';

function ReferenceNumberForm({
  onSubmit,
  onClose,
  initialPrefix,
  initialNumber,
  groupName,
  requestSubmitOptions,
}) {
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    prefix: Yup.string(),
    next_number: Yup.number(),
  });

  const initialValues = useMemo(
    () => ({
      prefix: initialPrefix || '',
      next_number: initialNumber || '',
    }),
    [],
  );

  const {
    errors,
    values,
    touched,
    setFieldValue,
    resetForm,
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
      const options = optionsMapToArray(values).map((option) => {
        return { key: option.key, ...option, group: groupName };
      });

      onSubmit(
        requestSubmitOptions({ options })
          .then(() => {
            setSubmitting(false);
          })

          .catch((erros) => {
            setSubmitting(false);
          }),
      );
    },
  });

  // Handles dialog close.
  // const handleClose = useCallback(() => {
  //   closeDialog(dialogName);
  // }, [closeDialog, dialogName]);

  // Handle dialog on closed.
  const onClosed = useCallback(() => {
    resetForm();
  }, [resetForm]);

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
                intent={errors.prefix && touched.prefix && Intent.DANGER}
                helperText={
                  <ErrorMessage name={'prefix'} {...{ errors, touched }} />
                }
              >
                <InputGroup
                  intent={errors.prefix && touched.prefix && Intent.DANGER}
                  {...getFieldProps('prefix')}
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

export default compose(withSettingsActions)(ReferenceNumberForm);
