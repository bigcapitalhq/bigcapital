import moment from 'moment';

export default (Model) => {
  return class DateSession extends Model {

    get timestamps() {
      return ['createdAt', 'updatedAt'];
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
  }
}