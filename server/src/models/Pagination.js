import { Model } from 'objection';

export default class PaginationQueryBuilder extends Model.QueryBuilder {
  pagination(page, pageSize) {
    return super.page(page, pageSize).runAfter(
      ({ results, total }) => {
        return {
          results,
          pagination: {
            total,
            page: page + 1,
            pageSize,
          },
        };
      })
  }
}