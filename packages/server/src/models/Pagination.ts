import { Model } from 'objection';
import { castArray, omit, pick } from 'lodash';
import { isEmpty } from 'lodash';
import { ServiceError } from '@/exceptions';

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

  queryAndThrowIfHasRelations = ({
    type,
    message,
    excludeRelations = [],
    includedRelations = [],
  }) => {
    const _excludeRelations = castArray(excludeRelations);
    const _includedRelations = castArray(includedRelations);

    const model = this.modelClass();
    const modelRelations = Object.keys(model.relationMappings).filter(
      (relation) =>
        [Model.HasManyRelation, Model.HasOneRelation].indexOf(
          model.relationMappings[relation]?.relation
        ) !== -1
    );
    const relations = model.secureDeleteRelations || modelRelations;
    const filteredByIncluded = relations.filter((r) =>
      _includedRelations.includes(r)
    );
    const filteredByExcluded = relations.filter(
      (r) => !excludeRelations.includes(r)
    );
    const filteredRelations = !isEmpty(_includedRelations)
      ? filteredByIncluded
      : !isEmpty(_excludeRelations)
      ? filteredByExcluded
      : relations;

    this.runAfter((model, query) => {
      const nonEmptyRelations = filteredRelations.filter(
        (relation) => !isEmpty(model[relation])
      );
      if (nonEmptyRelations.length > 0) {
        throw new ServiceError(type || 'MODEL_HAS_RELATIONS', { message });
      }
      return model;
    });
    return this.onBuild((query) => {
      filteredRelations.forEach((relation) => {
        query.withGraphFetched(`${relation}(selectId)`).modifiers({
          selectId(builder) {
            builder.select('id');
          },
        });
      });
    });
  };
}
