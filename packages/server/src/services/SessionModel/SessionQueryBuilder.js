import SessionModel from '@/services/SessionModel';

export default class SessionQueryBuilder extends SessionModel.QueryBuilder {
  /**
   * Add a custom method that stores a session object to the query context.
   * @param {*} session -
   */
  session(session) {
    return this.mergeContext({
      session,
    });
  }
}
