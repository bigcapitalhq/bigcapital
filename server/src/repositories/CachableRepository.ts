import hashObject from 'object-hash';


export default class CachableRepository {
  repositoryName: string;
 
  /**
   * Retrieve the cache key of the method name and arguments.
   * @param {string} method 
   * @param {...any} args 
   * @return {string}
   */
  getCacheKey(method, ...args) {
    const hashArgs = hashObject({ ...args });
    const repositoryName = this.repositoryName;

    return `${repositoryName}-${method}-${hashArgs}`;
  }
}