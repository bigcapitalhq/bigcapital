import sinon from 'sinon';
import { create, expect } from '~/testInit';
import Setting from '@/models/Setting';
import knex from '../../src/database/knex';

describe('Model: Setting', () => {
  afterEach(() => {
    Setting.purgeMetadata();
  });

  describe('Setting.AllMeta()', async () => {
    it('Should fetch all metadata from storage in the first call.', async () => {
      await create('setting');
      const querySpy = sinon.spy(Setting, 'query');

      const metadata = await Setting.allMeta();

      expect(querySpy.calledOnce).equals(true);
      expect(metadata).to.have.lengthOf(1);

      querySpy.restore();
    });

    it('Should get all meta data from stored cache in the second call.', async () => {
      await create('setting');
      const querySpy = sinon.spy(Setting, 'query');

      await Setting.allMeta();
      await Setting.allMeta();

      expect(querySpy.calledOnce).equals(true);
      expect(Setting.metadata).to.have.lengthOf(1);

      querySpy.restore();
    });
  });

  describe('Setting.getMeta()', () => {
    it('Should fetch metadata of the given key from storage.', async () => {
      const setting = await create('setting');
      const metadata = await Setting.getMeta(setting.key);

      expect(metadata).equals(setting.value);
    });

    it('Should retrieve the default value if the metadata key was not found.', async () => {
      const metadata = await Setting.getMeta('setting', 'default');
      expect(metadata).equals('default');
    });

    it('Should get the same metadata key from cache in the second call.', async () => {
      const setting = await create('setting');
      await create('setting');

      const querySpy = sinon.spy(Setting, 'query');

      await Setting.getMeta(setting.key);
      expect(querySpy.calledOnce).equals(true);

      await Setting.getMeta(setting.key);
      expect(querySpy.calledOnce).equals(true);

      querySpy.restore();
    });

    it('Should get the different metadata key from storage.', async () => {
      const setting = await create('setting');
      const settingAnother = await create('setting');

      const querySpy = sinon.spy(Setting, 'query');

      await Setting.getMeta(setting.key);
      expect(querySpy.calledOnce).equals(true);

      await Setting.getMeta(settingAnother.key);
      expect(querySpy.calledOnce).equals(true);

      querySpy.restore();
    });

    it('Should hard fetching the metadata from the storage when passing `force` parameter.', async () => {
      const setting = await create('setting');
      await create('setting');

      const querySpy = sinon.spy(Setting, 'query');

      await Setting.allMeta();
      expect(querySpy.calledOnce).equals(true);
      expect(Setting.metadata).to.have.lengthOf(2);

      await Setting.getMeta(setting.key, null, true);
      expect(querySpy.calledTwice).equals(true);
      expect(Setting.metadata).to.have.lengthOf(2);

      querySpy.restore();
    });
  });

  describe('Setting.setMeta()', () => {
    it('Should mark the given metadata as updated in the stack.', async () => {
      const setting = await create('setting');
      await Setting.setMeta(setting.key, 'Ahmed');

      const foundMeta = Setting.metadata.find((metadata) => (
        metadata.key === setting.key && metadata.markAsUpdated === true
          && metadata.value === 'Ahmed'
      ));
      expect(!!foundMeta).equals(true);
    });

    it('Should mark the set metadata as inserted metadata in the stack.', async () => {
      await create('setting');
      await Setting.setMeta('key', 'value');

      const foundMeta = Setting.metadata.find((metadata) => (
        metadata.key === 'key' && metadata.markAsInserted === true
          && metadata.value === 'value'
      ));
      expect(!!foundMeta).equals(true);
    });

    it('Should fetch the metadata from the storage in case the metadata was exist.', async () => {
      const setting = await create('setting');
      const querySpy = sinon.spy(Setting, 'query');

      await Setting.setMeta(setting.key, 'value');
      expect(querySpy.calledOnce).equals(true);

      await Setting.setMeta(setting.key, 'updated-value');
      expect(querySpy.calledOnce).equals(true);
    });

    it('Should mark the updated bluk metadata as updated in the stock.', async () => {

    });

    it('Should mark the inserted bluk metadata as inserted in the stock.', async () => {

    });
  });

  describe('Setting.removeMeta()', () => {
    it('Should mark the given metadata as deleted', async () => {
      const setting = await create('setting');
      await Setting.removeMeta(setting.key);

      const foundMeta = Setting.metadata.find((metadata) => (
        metadata.key === setting.key && metadata.markAsDeleted === true
      ));
      expect(!!foundMeta).equals(true);
    });

    it('Should not query the storage when found cached the metadata.', async () => {
      const setting = await create('setting');
      await Setting.allMeta();

      const querySpy = sinon.spy(Setting, 'query');

      await Setting.removeMeta(setting.key);
      expect(querySpy.calledOnce).equals(false);

      querySpy.restore();
    });
  });

  describe('Setting.saveMeta()', () => {
    it('Should insert the metadata that set to the stock.', async () => {
      await Setting.setMeta('key', 'value');
      await Setting.saveMeta();

      const storedMetadata = await knex('settings');
      expect(storedMetadata).to.have.lengthOf(1);
    });

    it('Should update the metadata that updated in the stock.', async () => {
      const setting = await create('setting');

      await Setting.setMeta(setting.key, 'value');
      await Setting.saveMeta();

      const storedMetadata = await knex('settings');

      expect(storedMetadata).to.have.lengthOf(1);
      expect(storedMetadata[0].value).equals('value');
    });

    it('Should delete the metadata that removed from the stock.', async () => {
      const setting = await create('setting');

      await Setting.removeMeta(setting.key);
      await Setting.saveMeta();

      const storedMetadata = await knex('settings');
      expect(storedMetadata).to.have.lengthOf(0);
    });
  });
});
