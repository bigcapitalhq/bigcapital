import { Transformer } from '../Transformer/Transformer';
import { View } from './models/View.model';

export class GetResourceViewTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return ['name'];
  };

  name(view: View) {
    return this.context.i18n.t(view.name);
  }
}
