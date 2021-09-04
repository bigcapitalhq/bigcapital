import moment from "moment";
import { isEmpty, isObject, isUndefined } from 'lodash';

export class Transformer {
  /**
   * Includeded attributes.
   * @returns 
   */
  protected includeAttributes = (): string[] => {
    return [];
  }

  /**
   * 
   */
  public transform = (object: any) => {
    if (Array.isArray(object)) {
      return object.map(this.getTransformation);
    } else if (isObject(object)) {
      return this.getTransformation(object);
    }
    return object;
  };

  /**
   * 
   * @param item 
   * @returns 
   */
  protected getTransformation = (item) => {
    const attributes = this.getIncludeAttributesTransformed(item);

    return {
      ...!isUndefined(item.toObject) ? item.toObject() : item,
      ...attributes
    };
  };

  /**
   * 
   * @param item 
   * @returns 
   */
  protected getIncludeAttributesTransformed = (item) => {
    const attributes = this.includeAttributes();    

    return attributes
      .filter((attribute) => !isUndefined(this[attribute]))
      .reduce((acc, attribute: string) => {
        acc[attribute] = this[attribute](item);

        return acc;
      }, {});
  }

  /**
   * 
   * @param date 
   * @returns 
   */
  protected formatDate(date) {
    return date ? moment(date).format('YYYY/MM/DD') : '';
  }
}
