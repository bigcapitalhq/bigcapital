import { Inject, Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateCustomer } from '@/modules/Customers/commands/CreateCustomer.service';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareCustomerMapping } from '../models/SquareCustomerMapping.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';

/**
 * Resolves the Bigcapital `Customer` id to attribute a Square sale to.
 *
 *   1. No Square customer attached → use the wizard walk-in customer.
 *   2. Square customer in `square_customer_mappings` → return the mapped id.
 *   3. Square customer not yet mapped → fetch from Square, auto-create a
 *      Bigcapital Customer with sensible defaults, write the mapping, return.
 *
 * Auto-created mappings are flagged `auto_created=true` so admins can
 * review them later (e.g. to deduplicate against an existing customer).
 */
@Injectable()
export class ResolveBigcapitalCustomer {
  private readonly logger = new Logger(ResolveBigcapitalCustomer.name);

  constructor(
    private readonly createCustomer: CreateCustomer,
    private readonly squareApi: SquareApiClient,

    @Inject(SquareCustomerMapping.name)
    private readonly mappingModel: TenantModelProxy<typeof SquareCustomerMapping>,
  ) {}

  public async resolve(params: {
    connection: SquareConnection;
    squareCustomerId: string | null | undefined;
    trx?: Knex.Transaction;
  }): Promise<number> {
    const { connection, squareCustomerId, trx } = params;

    if (!squareCustomerId) {
      if (!connection.walkInCustomerId) {
        throw new Error(
          'Square sale has no customer attached and connection has no walk-in customer configured.',
        );
      }
      return connection.walkInCustomerId;
    }

    const existing = await this.mappingModel()
      .query(trx)
      .findOne({ connectionId: connection.id, squareCustomerId });
    if (existing?.customerId) {
      return existing.customerId;
    }

    // Auto-create from Square's customer payload.
    const fetched = await this.fetchSquareCustomer(connection, squareCustomerId);
    const dto = this.buildCustomerDto(fetched);
    const created = await this.createCustomer.createCustomer(dto, trx);

    await this.mappingModel()
      .query(trx)
      .insert({
        connectionId: connection.id,
        squareCustomerId,
        customerId: created.id,
        autoCreated: true,
      });

    this.logger.log(
      `Auto-created Bigcapital customer id=${created.id} for Square customer ${squareCustomerId} (connection ${connection.id})`,
    );
    return created.id;
  }

  private async fetchSquareCustomer(
    connection: SquareConnection,
    squareCustomerId: string,
  ): Promise<any> {
    const res = await this.squareApi.request(connection, {
      method: 'GET',
      url: `/v2/customers/${encodeURIComponent(squareCustomerId)}`,
    });
    if (res.status !== 200) {
      throw new Error(
        `Failed to fetch Square customer ${squareCustomerId}: ${res.status} ${JSON.stringify(res.data)}`,
      );
    }
    return res.data?.customer ?? {};
  }

  private buildCustomerDto(c: any) {
    const firstName: string | undefined = c?.given_name?.trim() || undefined;
    const lastName: string | undefined = c?.family_name?.trim() || undefined;
    const companyName: string | undefined =
      c?.company_name?.trim() || undefined;

    let displayName = companyName ?? [firstName, lastName].filter(Boolean).join(' ');
    if (!displayName) {
      displayName = c?.email_address || c?.phone_number || `Square Customer ${c?.id ?? ''}`;
    }
    const customerType: 'business' | 'person' = companyName ? 'business' : 'person';

    return {
      customerType,
      currencyCode: 'USD',
      displayName,
      firstName,
      lastName,
      companyName,
      email: c?.email_address || undefined,
      personalPhone: c?.phone_number || undefined,
      active: true,
    } as any;
  }
}
