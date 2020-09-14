

export default class BaseModelRepository {

  isExists(modelIdOrArray) {
    const ids = Array.isArray(modelIdOrArray) ? modelIdOrArray : [modelIdOrArray];
    const foundModels = this.model.tenant().query().whereIn('id', ids);

    return foundModels.length > 0;
  }
}