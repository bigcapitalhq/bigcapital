import moment from 'moment';

export default (Model) => {
  return class DateSession extends Model {

    get timestamps() {
      return ['createdAt', 'updatedAt'];
    }

    $beforeUpdate(opt, context) {
      const maybePromise = super.$beforeUpdate(opt, context);

      return Promise.resolve(maybePromise).then(() => {
        if (this.timestamps[1]) {
          this[this.timestamps[1]] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }

    $beforeInsert(context) {
      const maybePromise = super.$beforeInsert(context);

      return Promise.resolve(maybePromise).then(() => {
        if (this.timestamps[0]) {
          this[this.timestamps[0]] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }
  }
}