import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TrackingTag } from '../models/TrackingTag';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetTrackingTagService {
  constructor(
    @Inject(TrackingTag.name)
    private trackingTagModel: TenantModelProxy<typeof TrackingTag>,
  ) {}

  /**
   * Retrieves a tracking tag by ID with its options.
   * @param {number} tagId
   * @returns {Promise<TrackingTag>}
   */
  public getTrackingTag = async (tagId: number): Promise<TrackingTag> => {
    const tag = await this.trackingTagModel()
      .query()
      .findById(tagId)
      .withGraphFetched('options');

    if (!tag) {
      throw new NotFoundException('Tracking tag not found.');
    }

    return tag;
  };
}
