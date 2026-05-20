import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TrackingTag } from '../models/TrackingTag';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditTrackingTagDto } from '../dtos/TrackingTag.dto';

@Injectable()
export class EditTrackingTagService {
  constructor(
    @Inject(TrackingTag.name)
    private trackingTagModel: TenantModelProxy<typeof TrackingTag>,
  ) {}

  /**
   * Edits a tracking tag.
   * @param {number} tagId
   * @param {EditTrackingTagDto} dto
   * @returns {Promise<TrackingTag>}
   */
  public editTrackingTag = async (
    tagId: number,
    dto: EditTrackingTagDto,
  ): Promise<TrackingTag> => {
    const tag = await this.trackingTagModel()
      .query()
      .findById(tagId)
      .throwIfNotFound();

    const updatePayload: any = {};

    if (dto.name !== undefined) updatePayload.name = dto.name;
    if (dto.description !== undefined) updatePayload.description = dto.description;
    if (dto.active !== undefined) updatePayload.active = dto.active;

    if (dto.options) {
      updatePayload.options = dto.options.map((opt) => ({
        ...(opt.id ? { id: opt.id } : {}),
        name: opt.name,
        active: opt.active,
      }));
    }

    await this.trackingTagModel()
      .query()
      .upsertGraphAndFetch({
        id: tagId,
        ...updatePayload,
      });

    const updatedTag = await this.trackingTagModel()
      .query()
      .findById(tagId)
      .withGraphFetched('options')
      .throwIfNotFound();

    return updatedTag;
  };
}
