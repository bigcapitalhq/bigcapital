// @ts-nocheck
import moment from 'moment';
import * as Yup from 'yup';
import intl from 'react-intl-universal';

/**
 * Retrieves the validation schema.
 * @returns {Yup}
 */
export const getSalesByItemsQueryShema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
};

/**
 * Retrieves the default query.
 */
export const getDefaultSalesByItemsQuery = () => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().endOf('year').format('YYYY-MM-DD'),
  filterByOption: 'with-transactions',
  itemsIds: [],
});
