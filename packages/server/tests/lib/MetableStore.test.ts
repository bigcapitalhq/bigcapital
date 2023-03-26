import { expect } from '~/testInit';
import MetableStore from '@/lib/MetableStore';

describe('MetableStore()', () => { 

  describe('find', () => {
    it('Find metadata by the given key.', () => {
      const store = new MetableStore();
      store.metadata = [{ key: 'first-key', value: 'first-value' }];

      const meta = store.find('first-key');

      expect(meta.value).equals('first-value');
      expect(meta.key).equals('first-key');
    });

    it('Find metadata by the key as payload.', () => {
      
    });

    it('Find metadata by the given key and extra columns.', () => {

    });
  });

  describe('all()', () => {
    it('Should retrieve all metadata in the store.', () => {

    });
  });

  describe('get()', () => {
    it('Should retrieve data of the given metadata query.', () => {

    });
  });

  describe('removeMeta')
});