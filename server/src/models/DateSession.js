import moment from 'moment';

export default (Model) => {
  return class DateSession extends Model {

    static get timestamps() {
      return ['createdAt', 'updatedAt'];
    }

    $beforeUpdate(opt, context) {
      const maybePromise = super.$beforeUpdate(opt, context);

      return Promise.resolve(maybePromise).then(() => {
        if (DateSession.timestamps[1]) {
          this[DateSession.timestamps[1]] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }

    $beforeInsert(context) {
      const maybePromise = super.$beforeInsert(context);

      return Promise.resolve(maybePromise).then(() => {
        if (DateSession.timestamps[0]) {
          this[DateSession.timestamps[0]] = moment().format('YYYY/MM/DD HH:mm:ss');
        }
      });
    }
  }
}