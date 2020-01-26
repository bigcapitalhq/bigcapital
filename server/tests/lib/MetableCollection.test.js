import Option from '@/models/Option';
import MetadataCollection from '@/lib/Metable/MetableCollection';
import ResourceFieldMetadata from '@/models/ResourceFieldMetadata';
import { create, expect } from '~/testInit';

describe('MetableCollection', () => {
  describe('findMeta', () => {
    it('Should retrieve the found meta object.', async () => {
      const option = await create('option');
      const metadataCollection = await Option.query();

      const foundMeta = metadataCollection.findMeta(option.key);
      expect(foundMeta).to.be.an('object');
    });
  });

  describe('allMetadata', () => {
    it('Should retrieve all exists metadata entries.', async () => {
      const option = await create('option');
      const metadataCollection = await Option.query();
      const foundMetadata = metadataCollection.allMetadata();

      expect(foundMetadata.length).equals(1);
    });
  });

  describe('getMeta', () => {
    it('Should retrieve the found meta value.', async () => {
      const option = await create('option');
      const metadataCollection = await Option.query();

      const foundMeta = metadataCollection.getMeta(option.key);
      expect(foundMeta).equals(option.value);
    });

    it('Should retrieve the default meta value in case the meta key was not exist.', async () => {
      const option = await create('option');
      const metadataCollection = await Option.query();

      const foundMeta = metadataCollection.getMeta('not-found', true);
      expect(foundMeta).equals(true);
    });
  });

  describe('setMeta', () => {
    it('Should sets the meta value to the stack.', async () => {
      const metadataCollection = new MetadataCollection();
      metadataCollection.setMeta('key', 'value');

      expect(metadataCollection.metadata.length).equals(1);
    });
  });

  describe('removeAllMeta()', () => {
    it('Should remove all metadata from the stack.', async () => {
      const metadataCollection = new MetadataCollection();

      metadataCollection.setModel(Option);
      metadataCollection.setMeta('key', 'value');
      metadataCollection.setMeta('key2', 'value2');

      metadataCollection.removeAllMeta();

      expect(metadataCollection.metadata.length).equals(2);
      expect(metadataCollection.allMetadata().length).equals(0);
    });
  });

  describe('saveMeta', () => {
    it('Should save inserted new metadata.', async () => {
      const metadataCollection = new MetadataCollection();

      metadataCollection.setModel(Option);
      metadataCollection.setMeta('key', 'value');
      metadataCollection.setModel(Option);

      await metadataCollection.saveMeta();

      const storedMetadata = await Option.query();
      expect(storedMetadata.metadata.length).equals(1);
    });

    it('Should save updated the exist metadata.', async () => {
      const option = await create('option');
      const metadataCollection = new MetadataCollection();

      metadataCollection.setModel(Option);
      metadataCollection.setMeta(option.key, 'value');
      metadataCollection.setModel(Option);

      await metadataCollection.saveMeta();

      const storedMetadata = await Option.query().where('key', option.key).first();
      expect(storedMetadata.value).equals('value');
    });

    it('Should delete the removed metadata from storage.', async () => {
      const option = await create('option');

      const options = await Option.query();
      const metadataCollection = MetadataCollection.from(options);
      metadataCollection.setModel(Option);
      metadataCollection.removeMeta(option.key);

      expect(metadataCollection.metadata.length).equals(1);
      await metadataCollection.saveMeta();

      const storedMetadata = await Option.query();
      expect(storedMetadata.length).equals(0);
    });

    it('Should save instered new metadata with extra columns.', async () => {
      const resource = await create('resource');

      const metadataCollection = new MetadataCollection();
      metadataCollection.extraColumns = ['resource_id'];

      metadataCollection.setModel(ResourceFieldMetadata);
      metadataCollection.setMeta('key', 'value', { resource_id: resource.id });

      await metadataCollection.saveMeta();

      const storedMetadata = await ResourceFieldMetadata.query().first();

      expect(storedMetadata.metadata.length).equals(1);
      expect(storedMetadata.metadata[0].resourceId).equals(resource.id);
    });
  });
});
