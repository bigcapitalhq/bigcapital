import * as moment from 'moment';
import { Model } from 'objection';

type Constructor<T = {}> = new (...args: any[]) => T;

export const withDateSessionMixin = <T extends Constructor<Model>>(
  BaseModel: T,
) => {
  return class DateSession extends BaseModel {
    constructor(...args: any[]) {
      super(...args);
    }

    get timestamps() {
      return [];
    }

    $beforeUpdate(opt, context) {
      const maybePromise = super.$beforeUpdate(opt, context);

      return Promise.resolve(maybePromise).then(() => {
        const key = this.timestamps[1];

        if (key && !this[key]) {
          this[key] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }

    $beforeInsert(context) {
      const maybePromise = super.$beforeInsert(context);

      return Promise.resolve(maybePromise).then(() => {
        const key = this.timestamps[0];

        if (key && !this[key]) {
          this[key] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }
  };
};
