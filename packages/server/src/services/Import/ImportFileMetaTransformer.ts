import { Transformer } from '@/lib/Transformer/Transformer';

export class ImportFileMetaTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['map'];
  };

  public excludeAttributes = (): string[] => {
    return ['id', 'filename', 'columns', 'mappingParsed', 'mapping'];
  }

  map(importFile) {
    return  importFile.mappingParsed;
  }
}
