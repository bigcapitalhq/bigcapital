import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TrackingTag } from '../models/TrackingTag';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteTrackingTagService {
  constructor(
    @Inject(TrackingTag.name)
    private trackingTagModel: TenantModelProxy<typeof TrackingTag>,
  ) {}

  /**
   * Deletes a tracking tag.
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  public deleteTrackingTag = async (tagId: number): Promise<void> => {
    const tag = await this.trackingTagModel()
      .query()
      .findById(tagId)
      .throwIfNotFound();

    await this.trackingTagModel().query().deleteById(tagId);
  };
}
