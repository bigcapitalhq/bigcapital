import { Transformer } from '@/modules/Transformer/Transformer';
import { normalizeTrackingCategoryModules } from '../utils';

export class TrackingCategoryOptionTransformer extends Transformer {
  /**
   * Include these attributes to the option object.
   */
  public includeAttributes = (): string[] => {
    return ['active'];
  };

  /**
   * Converts the stored 0/1 flag to a boolean.
   */
  protected active = (option): boolean => {
    return Boolean(option.active);
  };
}

export class TrackingCategoryTransformer extends Transformer {
  /**
   * Converts the stored 0/1 flag to a boolean and transforms the options.
   */
  public transform = (category) => {
    return {
      ...category,
      active: Boolean(category.active),
      modules: normalizeTrackingCategoryModules(category.modules),
      options: this.item(
        category.options ?? [],
        new TrackingCategoryOptionTransformer(),
      ),
    };
  };
}
