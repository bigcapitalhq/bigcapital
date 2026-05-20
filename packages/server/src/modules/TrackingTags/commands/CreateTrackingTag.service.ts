import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TrackingTag } from '../models/TrackingTag';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateTrackingTagDto } from '../dtos/TrackingTag.dto';

@Injectable()
export class CreateTrackingTagService {
  constructor(
    @Inject(TrackingTag.name)
    private trackingTagModel: TenantModelProxy<typeof TrackingTag>,
  ) {}

  /**
   * Creates a new tracking tag with options.
   * @param {CreateTrackingTagDto} dto
   * @returns {Promise<TrackingTag>}
   */
  public createTrackingTag = async (dto: CreateTrackingTagDto): Promise<TrackingTag> => {
    const tag = await this.trackingTagModel()
      .query()
      .insertGraphAndFetch({
        name: dto.name,
        description: dto.description,
        active: dto.active,
        options: dto.options.map((opt) => ({
          name: opt.name,
          active: opt.active,
        })),
      });

    return tag;
  };
}
