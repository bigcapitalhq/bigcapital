import { Button, ButtonProps, Intent, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { ErrorMessage, Form, Formik, useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import '../style/components/Batches.scss';
import type { Batch } from '@/ee/batches/hooks/query/queries';
import {
  AppToaster,
  FDateInput,
  FInputGroup,
  FNumericInput,
  FormattedMessage as T,
} from '@/components';
import { useCreateBatch, useEditBatch } from '@/ee/batches/hooks/query';
import { useDateInputFormatter } from '@/hooks';
interface BatchFormValues {
  batchNumber: string;
  batchRef: string;
  manufacturedDate: Date | null;
  expiryDate: Date | null;
  quantity: number | '';
}

interface BatchFormProps {
  itemId: number;
  batch?: Batch | null;
  defaultQuantity?: number | string;
  onSaved?: (batch: Batch) => void;
  onCancel?: () => void;
  sourceTransactionType?: string;
}

const getBatchFormSchema = () =>
  Yup.object().shape({
    batchNumber: Yup.string().required().max(191),
    batchRef: Yup.string().nullable().max(191),
    quantity: Yup.number().nullable().min(0),
    manufacturedDate: Yup.date().nullable(),
    expiryDate: Yup.date()
      .nullable()
      .when('manufacturedDate', (manufacturedDate, schema) =>
        manufacturedDate
          ? schema.min(
              manufacturedDate,
              intl.get('batch.validation.expiry_after_manufactured'),
            )
          : schema,
      ),
  });

type BatchFormContentProps = Pick<
  BatchFormProps,
  'batch' | 'onSaved' | 'onCancel'
>;

/**
 * Form rendered inside the batch popover.
 */
function BatchFormContent({ batch, onSaved, onCancel }: BatchFormContentProps) {
  const dateInputFormatter = useDateInputFormatter();
  const { submitForm, isSubmitting } = useFormikContext<BatchFormValues>();

  return (
    <Form
      className="batch-form batch-form--table"
      onSubmitCapture={(event) => event.stopPropagation()}
    >
      <div className="batch-form__header">
        <strong>
          {batch ? (
            <T id={'batch.form.edit_title'} />
          ) : (
            <T id={'batch.form.new_title'} />
          )}
        </strong>
      </div>

      <div className="batch-form__table-wrapper">
        <table className="batch-form-table">
          <thead>
            <tr>
              <th>
                {intl.get('batch.form.batch_number')}
                <span className="batch-form__required">*</span>
              </th>
              <th>{intl.get('batch.form.batch_ref')}</th>
              <th className="batch-form-table__col-date">
                {intl.get('batch.form.manufactured_date')}
              </th>
              <th className="batch-form-table__col-date">
                {intl.get('batch.form.expiry_date')}
              </th>
              <th className="batch-form-table__col-quantity">
                {intl.get('batch.form.quantity')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <FInputGroup
                  name={'batchNumber'}
                  placeholder={intl.get('batch.form.batch_number_placeholder')}
                  autoFocus
                  fill={true}
                />
                <ErrorMessage
                  name={'batchNumber'}
                  component={'div'}
                  className={'batch-form__cell-error'}
                />
              </td>
              <td>
                <FInputGroup
                  name={'batchRef'}
                  placeholder={intl.get('batch.form.batch_ref_placeholder')}
                  fill={true}
                />
              </td>
              <td className={'batch-form-table__col-date'}>
                <FDateInput
                  name={'manufacturedDate'}
                  {...dateInputFormatter}
                  placeholder={dateInputFormatter.placeholder}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  fill={true}
                />
              </td>
              <td className={'batch-form-table__col-date'}>
                <FDateInput
                  name={'expiryDate'}
                  {...dateInputFormatter}
                  placeholder={dateInputFormatter.placeholder}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  fill={true}
                />
                <ErrorMessage
                  name={'expiryDate'}
                  component={'div'}
                  className={'batch-form__cell-error'}
                />
              </td>
              <td>
                <FNumericInput name={'quantity'} min={0} fill={true} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={'batch-form__hint'}>
        <T id={'batch.form.quantity_hint'} />
      </p>

      <div className="batch-form__footer">
        <Button
          small={true}
          minimal={true}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <T id={'cancel'} />
        </Button>
        <Button
          small={true}
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          onClick={submitForm}
          type={'button'}
        >
          <T id={'save'} />
        </Button>
      </div>
    </Form>
  );
}

interface BatchFormPopoverProps extends BatchFormProps {
  buttonProps?: ButtonProps;
  buttonText?: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  usePortal?: boolean;
  disabled?: boolean;
  popoverClassName?: string;
}

/**
 * Popover containing the create/edit batch form.
 */
export function BatchFormPopover({
  itemId,
  batch,
  defaultQuantity,
  onSaved,
  sourceTransactionType,
  buttonProps,
  buttonText,
  placement = 'bottom-start',
  usePortal = true,
  disabled,
  popoverClassName,
}: BatchFormPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync: createBatch } = useCreateBatch();
  const { mutateAsync: editBatch } = useEditBatch();
  const batchFormSchema = React.useMemo(() => getBatchFormSchema(), []);

  const initialValues: BatchFormValues = React.useMemo(
    () => ({
      batchNumber: batch?.batchNumber ?? '',
      batchRef: batch?.batchRef ?? '',
      manufacturedDate: batch?.manufacturedDate
        ? moment(batch.manufacturedDate).toDate()
        : null,
      expiryDate: batch?.expiryDate ? moment(batch.expiryDate).toDate() : null,
      quantity:
        defaultQuantity !== undefined && defaultQuantity !== ''
          ? Number(defaultQuantity) || 0
          : (batch?.quantity ?? 0),
    }),
    [batch, defaultQuantity],
  );

  const handleSubmit = async (values: BatchFormValues) => {
    const payload = {
      itemId,
      batchNumber: values.batchNumber.trim(),
      batchRef: values.batchRef?.trim() || undefined,
      manufacturedDate: values.manufacturedDate
        ? moment(values.manufacturedDate).format('YYYY-MM-DD')
        : undefined,
      expiryDate: values.expiryDate
        ? moment(values.expiryDate).format('YYYY-MM-DD')
        : undefined,
      quantity: Number(values.quantity) || 0,
      sourceTransactionType,
    };
    try {
      const savedBatch = batch
        ? await editBatch({ id: batch.id, ...payload })
        : await createBatch(payload);

      onSaved?.(savedBatch as Batch);
      setIsOpen(false);
      AppToaster.show({
        message: batch
          ? intl.get('batch.form.saved_success')
          : intl.get('batch.form.created_success'),
        intent: Intent.SUCCESS,
      });
    } catch (error) {
      // The fetcher error handler displays the API error.
    }
  };

  return (
    <Popover2
      isOpen={isOpen}
      onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
      placement={placement}
      minimal={true}
      usePortal={usePortal}
      disabled={disabled}
      popoverClassName={popoverClassName}
      content={
        <div
          className={'batch-form-popover'}
          onClick={(event) => event.stopPropagation()}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={batchFormSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <BatchFormContent
              batch={batch}
              onSaved={onSaved}
              onCancel={() => setIsOpen(false)}
            />
          </Formik>
        </div>
      }
    >
      <Button
        small={true}
        minimal={true}
        icon={batch ? 'edit' : 'add'}
        intent={batch ? Intent.NONE : Intent.PRIMARY}
        {...buttonProps}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
          buttonProps?.onClick?.(event);
        }}
      >
        {buttonText ?? (batch ? batch.batchNumber : intl.get('batch.add'))}
      </Button>
    </Popover2>
  );
}
