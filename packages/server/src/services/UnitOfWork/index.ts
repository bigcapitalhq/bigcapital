import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';

/**
 * Enumeration that represents transaction isolation levels for use with the {@link Transactional} annotation
 */
export enum IsolationLevel {
  /**
   * A constant indicating that dirty reads, non-repeatable reads and phantom reads can occur.
   */
  READ_UNCOMMITTED = 'read uncommitted',
  /**
   * A constant indicating that dirty reads are prevented; non-repeatable reads and phantom reads can occur.
   */
  READ_COMMITTED = 'read committed',
  /**
   * A constant indicating that dirty reads and non-repeatable reads are prevented; phantom reads can occur.
   */
  REPEATABLE_READ = 'repeatable read',
  /**
   * A constant indicating that dirty reads, non-repeatable reads and phantom reads are prevented.
   */
  SERIALIZABLE = 'serializable',
}

@Service()
export default class UnitOfWork {
  @Inject()
  tenancy: TenancyService;

  /**
   *
   * @param {number} tenantId
   * @param {} work
   * @param {IsolationLevel} isolationLevel
   * @returns {}
   */
  public withTransaction = async (
    tenantId: number,
    work,
    isolationLevel: IsolationLevel = IsolationLevel.READ_UNCOMMITTED
  ) => {
    const knex = this.tenancy.knex(tenantId);
    const trx = await knex.transaction({ isolationLevel });

    try {
      const result = await work(trx);
      trx.commit();

      return result;
    } catch (error) {
      trx.rollback();
      throw error;
    }
  };
}
