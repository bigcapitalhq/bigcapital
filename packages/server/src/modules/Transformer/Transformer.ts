import * as moment from 'moment';
import * as R from 'ramda';
import { includes, isFunction, isObject, isUndefined, omit } from 'lodash';
// import { EXPORT_DTE_FORMAT } from '@/services/Export/constants';
import { formatNumber } from '@/utils/format-number';
import { TransformerContext } from './Transformer.types';

const EXPORT_DTE_FORMAT = 'YYYY-MM-DD';

export class Transformer<T = {}, ExtraContext = {}> {
  public context: ExtraContext & TransformerContext;
  public options: Record<string, any>;

  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return [];
  };

  /**
   * Detarmines whether to exclude all attributes except the include attributes.
   * @returns {boolean}
   */
  public isExcludeAllAttributes = () => {
    return includes(this.excludeAttributes(), '*');
  };

  /**
   *
   * @param object
   */
  transform = (object: any) => {
    return object;
  };

  /**
   *
   * @param object
   * @returns
   */
  protected preCollectionTransform = (object: any) => {
    return object;
  };

  /**
   *
   * @param object
   * @returns
   */
  protected postCollectionTransform = (object: any) => {
    return object;
  };

  /**
   *
   */
  public work = (object: any) => {
    if (Array.isArray(object)) {
      const preTransformed = this.preCollectionTransform(object);
      const transformed = preTransformed.map(this.getTransformation);

      return this.postCollectionTransform(transformed);
    } else if (isObject(object)) {
      return this.getTransformation(object);
    }
    return object;
  };

  /**
   * Transformes the given item to desired output.
   * @param item
   * @returns
   */
  protected getTransformation = (item) => {
    const normlizedItem = this.normalizeModelItem(item);

    return R.compose(
      // sortObjectKeysAlphabetically,
      this.transform,
      R.when(this.hasExcludeAttributes, this.excludeAttributesTransformed),
      this.includeAttributesTransformed,
    )(normlizedItem);
  };

  /**
   *
   * @param item
   * @returns
   */
  protected normalizeModelItem = (item) => {
    return !isUndefined(item.toJSON) ? item.toJSON() : item;
  };

  /**
   * Exclude attributes from the given item.
   */
  protected excludeAttributesTransformed = (item) => {
    const exclude = this.excludeAttributes();

    return omit(item, exclude);
  };

  /**
   * Incldues virtual attributes.
   */
  protected getIncludeAttributesTransformed = (item) => {
    const attributes = this.includeAttributes();

    return attributes
      .filter(
        (attribute) =>
          isFunction(this[attribute]) || !isUndefined(item[attribute]),
      )
      .reduce((acc, attribute: string) => {
        acc[attribute] = isFunction(this[attribute])
          ? this[attribute](item)
          : item[attribute];

        return acc;
      }, {});
  };

  /**
   *
   * @param item
   * @returns
   */
  protected includeAttributesTransformed = (item) => {
    const excludeAll = this.isExcludeAllAttributes();
    const virtualAttrs = this.getIncludeAttributesTransformed(item);

    return {
      ...(!excludeAll ? item : {}),
      ...virtualAttrs,
    };
  };

  /**
   *
   * @returns
   */
  private hasExcludeAttributes = () => {
    return this.excludeAttributes().length > 0;
  };

  private dateFormat = 'YYYY MMM DD';

  setDateFormat(format: string) {
    this.dateFormat = format;
  }

  /**
   * Format date.
   * @param {string} date
   * @param {string} format
   * @returns {string}
   */
  protected formatDate(date: string | Date, format?: string) {
    // Use the export date format if the async operation is in exporting,
    // otherwise use the given or default format.
    const _format = this.context.exportAls.isExport
      ? EXPORT_DTE_FORMAT
      : format || this.dateFormat;

    return date ? moment(date).format(_format) : '';
  }

  /**
   * Format date from now.
   * @param {string} date
   * @returns {string}
   */
  protected formatDateFromNow(date: moment.MomentInput) {
    return date ? moment(date).fromNow(true) : '';
  }

  /**
   * Format number.
   * @param {number | string} number
   * @param {any} props
   * @returns {string}
   */
  protected formatNumber(number: number | string, props?) {
    return formatNumber(number, { money: false, ...props });
  }

  /**
   *
   * @param money
   * @param options
   * @returns {}
   */
  protected formatMoney(money, options?) {
    return formatNumber(money, {
      currencyCode: this.context.organization.baseCurrency,
      money: true,
      ...options,
    });
  }

  /**
   *
   * @param obj
   * @param transformer
   * @param options
   */
  public item(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: any,
  ) {
    transformer.setOptions(options);
    transformer.setContext(this.context);
    transformer.setDateFormat(this.dateFormat);

    return transformer.work(obj);
  }

  /**
   * Sets custom options to the application.
   * @param   {} options
   * @returns {Transformer}
   */
  public setOptions(options) {
    this.options = options;
    return this;
  }

  /**
   * Sets the application context to the application.
   * @param   {} context
   * @returns {Transformer}
   */
  public setContext(context) {
    this.context = context;
    return this;
  }
}
