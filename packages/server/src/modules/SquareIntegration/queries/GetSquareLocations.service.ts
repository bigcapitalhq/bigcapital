import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';

export interface SquareLocationRow {
  id: string;
  name: string;
  businessName: string | null;
  status: string;
  address: string | null;
}

@Injectable()
export class GetSquareLocations {
  constructor(
    private readonly squareApi: SquareApiClient,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  public async list(connectionId: number): Promise<SquareLocationRow[]> {
    const connection = await this.connectionModel()
      .query()
      .findById(connectionId)
      .throwIfNotFound();

    const res = await this.squareApi.request(connection, {
      method: 'GET',
      url: '/v2/locations',
    });
    if (res.status !== 200) {
      throw new Error(
        `Square locations list failed: ${res.status} ${JSON.stringify(res.data)}`,
      );
    }
    return ((res.data?.locations ?? []) as any[]).map((l) => ({
      id: l.id,
      name: l.name,
      businessName: l.business_name ?? null,
      status: l.status,
      address: l.address
        ? [
            l.address.address_line_1,
            l.address.locality,
            l.address.administrative_district_level_1,
            l.address.postal_code,
          ]
            .filter(Boolean)
            .join(', ')
        : null,
    }));
  }
}
