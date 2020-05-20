import NodeCache from 'node-cache';

class Cache {

  constructor() {
    this.cache = new NodeCache({
      // stdTTL: 9999999,
      // checkperiod: 9999999 * 0.2,
      useClones: false,
    });
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    
    if (value) {
      return Promise.resolve(value);
    }
    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  set(key, results) {
    this.cache.set(key, results);
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}


export default new Cache();