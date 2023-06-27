import { Container } from 'typedi';
import BaseModel from 'models/Model';

export default class SystemModel extends BaseModel{
  /**
   * Logging all system database queries.
   * @param  {...any} args 
   */
  static query(...args) {
    const Logger = Container.get('logger');
    return super.query(...args).onBuildKnex(knexQueryBuilder => {
      knexQueryBuilder.on('query', queryData => {
        Logger.info(`[query][system] ${queryData.sql}`, {
          bindings: queryData.bindings,
        });
      });
    });
  }
}