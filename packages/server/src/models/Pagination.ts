import { ServiceError } from '@/exceptions';
import { isEmpty } from 'lodash';
import { Model } from 'objection';

export default class PaginationQueryBuilder extends Model.QueryBuilder {
  pagination(page, pageSize) {
    return super.page(page, pageSize).runAfter(({ results, total }) => {
      return {
        results,
        pagination: {
          total,
          page: page + 1,
          pageSize,
        },
      };
    });
  }

  queryAndThrowIfHasRelations = ({ type, message }) => {
    const model = this.modelClass();
    const modelRelations = Object.keys(model.relationMappings).filter(
      (relation) =>
        [Model.HasManyRelation, Model.HasOneRelation].indexOf(model.relationMappings[relation]?.relation) !== -1,
    );
    const relations = model.secureDeleteRelations || modelRelations;

    this.runAfter((model, query) => {
      const nonEmptyRelations = relations.filter((relation) => !isEmpty(model[relation]));
      if (nonEmptyRelations.length > 0) {
        throw new ServiceError(type || 'MODEL_HAS_RELATIONS', { message });
      }
      return model;
    });
    return this.onBuild((query) => {
      relations.forEach((relation) => {
        query.withGraphFetched(`${relation}(selectId)`).modifiers({
          selectId(builder) {
            builder.select('id');
          },
        });
      });
    });
  };
}
