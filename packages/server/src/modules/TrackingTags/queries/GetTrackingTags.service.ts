import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TrackingTag } from '../models/TrackingTag';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetTrackingTagsService {
  constructor(
    @Inject(TrackingTag.name)
    private trackingTagModel: TenantModelProxy<typeof TrackingTag>,
  ) {}

  /**
   * Retrieves all tracking tags with their options.
   * @returns {Promise<TrackingTag[]>}
   */
  public getTrackingTags = async (): Promise<TrackingTag[]> => {
    return this.trackingTagModel()
      .query()
      .withGraphFetched('options');
  };
}
