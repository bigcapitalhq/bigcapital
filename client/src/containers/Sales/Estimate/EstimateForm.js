import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent, FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import EstimateFormHeader from './EstimateFormHeader';
import EntriesItemsTable from './EntriesItemsTable';
import EstimateFloatingActions from './EstimateFloatingActions';

import withEstimateActions from './withEstimateActions';
import withEstimateDetail from './withEstimateDetail';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster, Row, Col } from 'components';
import Dragzone from 'components/Dragzone';
import useMedia from 'hooks/useMedia';
import { ERROR } from 'common/errors';

import { compose, repeatValue } from 'utils';

const MIN_LINES_NUMBER = 4;

const EstimateForm = ({
  //#WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  //#WithEstimateActions
  requestSubmitEstimate,
  requestEditEstimate,

  //#withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  estimateNextNumber,
  estimateNumberPrefix,

  //#withEstimateDetail
  estimate,

  //#own Props
  estimateId,
  onFormSubmit,
  onCancelForm,
}) => {
  const { formatMessage } = useIntl();
  const [payload, setPayload] = useState({});

  const {
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const savedMediaIds = useRef([]);
  const clearSavedMediaIds = () => {
    savedMediaIds.current = [];
  };

  useEffect(() => {
    if (estimate && estimate.id) {
      changePageTitle(formatMessage({ id: 'edit_estimate' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_estimate' }));
    }
  }, [changePageTitle, estimate, formatMessage]);

  const validationSchema = Yup.object().shape({
    customer_id: Yup.number()
      .label(formatMessage({ id: 'customer_name_' }))
      .required(),
    estimate_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'estimate_date_' })),
    expiration_date: Yup.date()
      .required()
      .label(formatMessage({ id: 'expiration_date_' })),
    estimate_number: Yup.string()
      .required()
      .nullable()
      .label(formatMessage({ id: 'estimate_number_' })),
    reference: Yup.string().min(1).max(255),
    note: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),
    terms_conditions: Yup.string()
      .trim()
      .min(1)
      .max(1024)
      .label(formatMessage({ id: 'note' })),
    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number()
        .nullable()
        .when(['rate'], {
          is: (rate) => rate,
          then: Yup.number().required(),
        }),
        rate: Yup.number().nullable(),
        item_id: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => quantity || rate,
            then: Yup.number().required(),
          }),
        discount: Yup.number().nullable(),
        description: Yup.string().nullable(),
      }),
    ),
  });

  const saveEstimateSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },
    [onFormSubmit],
  );

  const defaultEstimate = useMemo(
    () => ({
      index: 0,
      item_id: null,
      rate: null,
      discount: 0,
      quantity: null,
      description: '',
    }),
    [],
  );
  const estimateNumber = estimateNumberPrefix
    ? `${estimateNumberPrefix}-${estimateNextNumber}`
    : estimateNextNumber;

  const defaultInitialValues = useMemo(
    () => ({
      customer_id: '',
      estimate_date: moment(new Date()).format('YYYY-MM-DD'),
      expiration_date: moment(new Date()).format('YYYY-MM-DD'),
      estimate_number: estimateNumber,
      reference: '',
      note: '',
      terms_conditions: '',
      entries: [...repeatValue(defaultEstimate, MIN_LINES_NUMBER)],
    }),
    [defaultEstimate],
  );

  const orderingProductsIndex = (_entries) => {
    return _entries.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
  };

  const initialValues = useMemo(
    () => ({
      ...(estimate
        ? {
            ...pick(estimate, Object.keys(defaultInitialValues)),
            entries: [
              ...estimate.entries.map((estimate) => ({
                ...pick(estimate, Object.keys(defaultEstimate)),
              })),
              ...repeatValue(
                defaultEstimate,
                Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            entries: orderingProductsIndex(defaultInitialValues.entries),
          }),
    }),
    [estimate, defaultInitialValues, defaultEstimate],
  );

  const initialAttachmentFiles = useMemo(() => {
    return estimate && estimate.media
      ? estimate.media.map((attach) => ({
          preview: attach.attachment_file,
          uploaded: true,
          metadata: { ...attach },
        }))
      : [];
  }, [estimate]);

  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.ESTIMATE_NUMBER_IS_NOT_UNQIUE)) {
      setErrors({
        estimate_number: formatMessage({
          id: 'estimate_number_is_not_unqiue',
        }),
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      const entries = values.entries.filter(
        (item) => item.item_id && item.quantity,
      );
      const form = {
        ...values,
        entries,
      };
      const requestForm = { ...form };

      if (estimate && estimate.id) {
        requestEditEstimate(estimate.id, requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                {
                  id: 'the_estimate_has_been_successfully_edited',
                },
                { number: values.estimate_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            saveEstimateSubmit({ action: 'update', ...payload });
            resetForm();
          })
          .catch((errors) => {
            handleErrors(errors, { setErrors });
            setSubmitting(false);
          });
      } else {
        requestSubmitEstimate(requestForm)
          .then((response) => {
            AppToaster.show({
              message: formatMessage(
                { id: 'the_estimate_has_been_successfully_created' },
                { number: values.estimate_number },
              ),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            resetForm();
            saveEstimateSubmit({ action: 'new', ...payload });
          })
          .catch((errors) => {
            handleErrors(errors, { setErrors });
            setSubmitting(false);
          });
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('estimate_number', estimateNumber);
  }, [estimateNumber]);

  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      formik.submitForm();
    },
    [setPayload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles],
  );

  const handleClickAddNewRow = () => {
    formik.setFieldValue(
      'entries',
      orderingProductsIndex([...formik.values.entries, defaultEstimate]),
    );
  };

  const handleClearAllLines = () => {
    formik.setFieldValue(
      'entries',
      orderingProductsIndex([
        ...repeatValue(defaultEstimate, MIN_LINES_NUMBER),
      ]),
    );
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_ESTIMATE)}>
      <form onSubmit={formik.handleSubmit}>
        <EstimateFormHeader formik={formik} />
        <EntriesItemsTable
          entries={formik.values.entries}
          onClickAddNewRow={handleClickAddNewRow}
          onClickClearAllLines={handleClearAllLines}
          formik={formik}
        />

        <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
          <Row>
            <Col md={8}>
              <FormGroup
                label={<T id={'customer_note'} />}
                className={'form-group--customer_note'}
              >
                <TextArea
                  growVertically={true}
                  {...formik.getFieldProps('note')}
                />
              </FormGroup>

              <FormGroup
                label={<T id={'terms_conditions'} />}
                className={'form-group--terms_conditions'}
              >
                <TextArea
                  growVertically={true}
                  {...formik.getFieldProps('terms_conditions')}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <Dragzone
                initialFiles={initialAttachmentFiles}
                onDrop={handleDropFiles}
                onDeleteFile={handleDeleteFile}
                hint={'Attachments: Maxiumum size: 20MB'}
              />
            </Col>
          </Row>
        </div>
      </form>
      <EstimateFloatingActions
        formik={formik}
        onSubmitClick={handleSubmitClick}
        estimate={estimate}
        onCancelClick={handleCancelClick}
      />
    </div>
  );
};

export default compose(
  withEstimateActions,
  withEstimateDetail(),
  withDashboardActions,
  withMediaActions,
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
  })),
)(EstimateForm);
