import moment from 'moment';
import * as R from 'ramda';
import { includes, isFunction, isObject, isUndefined, omit } from 'lodash';
import { formatNumber } from 'utils';
import { isArrayLikeObject } from 'lodash/fp';

export class Transformer {
  public context: any;
  public options: Record<string, any>;

  /**
   * Included attributes.
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
   * Determines whether to exclude all attributes except the include attributes.
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
   * Transforms the given item to desired output.
   * @param item
   * @returns
   */
  protected getTransformation = (item) => {
    const normalizedItem = this.normalizeModelItem(item);

    return R.compose(
      this.transform,
      R.when(this.hasExcludeAttributes, this.excludeAttributesTransformed),
      this.includeAttributesTransformed
    )(normalizedItem);
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
   * Includes virtual attributes.
   */
  protected getIncludeAttributesTransformed = (item) => {
    const attributes = this.includeAttributes();

    return attributes
      .filter(
        (attribute) =>
          isFunction(this[attribute]) || !isUndefined(item[attribute])
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

  /**
   *
   * @param date
   * @returns
   */
  protected formatDate(date) {
    return date ? moment(date).format('YYYY/MM/DD') : '';
  }

  /**
   *
   * @param number
   * @returns
   */
  protected formatNumber(number) {
    return formatNumber(number, { money: false });
  }

  /**
   *
   * @param money
   * @param options
   * @returns
   */
  protected formatMoney(money, options?) {
    return formatNumber(money, {
      currencyCode: this.context.organization.baseCurrency,
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
    options?: any
  ) {
    transformer.setOptions(options);
    transformer.setContext(this.context);

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
