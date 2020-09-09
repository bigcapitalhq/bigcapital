import NodeCache from 'node-cache';

export default class Cache {
  cache: NodeCache;

  constructor(config?: object) {
    this.cache = new NodeCache({
      useClones: false,
      ...config,
    });
  }

  get(key: string, storeFunction: () => Promise<any>) {
    const value = this.cache.get(key);

    if (value) {
      return Promise.resolve(value);
    }
    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  set(key: string, results: any) {
    this.cache.set(key, results);
  }

  del(keys: string) {
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