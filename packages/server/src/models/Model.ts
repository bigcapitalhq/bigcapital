import { QueryBuilder, Model } from 'objection';
import { ModelHasRelationsError } from '@/common/exceptions/ModelHasRelations.exception';

interface PaginationResult<M extends Model> {
  results: M[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export type PaginationQueryBuilderType<M extends Model> = QueryBuilder<
  M,
  PaginationResult<M>
>;

export class PaginationQueryBuilder<
  M extends Model,
  R = M[],
> extends QueryBuilder<M, R> {
  pagination(page: number, pageSize: number): PaginationQueryBuilderType<M> {
    const query = super.page(page, pageSize);

    return query.runAfter(({ results, total }) => {
      return {
        results,
        pagination: {
          total,
          page: page + 1,
          pageSize,
        },
      };
    }) as unknown as PaginationQueryBuilderType<M>;
  }

  async deleteIfNoRelations({
    type,
    message,
  }: {
    type?: string;
    message?: string;
  } = {}) {
    const relationMappings = this.modelClass().relationMappings;
    const relationNames = Object.keys(relationMappings || {});

    if (relationNames.length === 0) {
      // No relations defined
      return this.delete();
    }

    // Only check HasManyRelation and ManyToManyRelation relations, as BelongsToOneRelation are just 
    // foreign key references and shouldn't prevent deletion. Only dependent records should block deletion.
    const dependentRelationNames = relationNames.filter((name) => {
      const relation = relationMappings[name];
      return relation && (
        relation.relation === Model.HasManyRelation ||
        relation.relation === Model.ManyToManyRelation
      );
    });

    if (dependentRelationNames.length === 0) {
      // No dependent relations defined, safe to delete
      return this.delete();
    }

    const recordQuery = this.clone();

    dependentRelationNames.forEach((relationName: string) => {
      recordQuery.withGraphFetched(relationName);
    });
    const record = await recordQuery;

    const hasRelations = dependentRelationNames.some((name) => {
      const val = record[name];
      return Array.isArray(val) ? val.length > 0 : val != null;
    });
    if (!hasRelations) {
      return this.clone().delete();
    } else {
      throw new ModelHasRelationsError(type, message);
    }
  }
}

export class BaseQueryBuilder<
  M extends Model,
  R = M[],
> extends PaginationQueryBuilder<M, R> {
  changeAmount(whereAttributes, attribute, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.where(whereAttributes)[changeMethod](
      attribute,
      Math.abs(amount),
    );
  }
}

export class BaseModel extends Model {
  public readonly id: number;
  public readonly tableName: string;

  QueryBuilderType!: BaseQueryBuilder<this>;
  static QueryBuilder = BaseQueryBuilder;
}
