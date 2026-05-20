import { Injectable } from '@nestjs/common';
import { CreateTrackingTagService } from './commands/CreateTrackingTag.service';
import { EditTrackingTagService } from './commands/EditTrackingTag.service';
import { DeleteTrackingTagService } from './commands/DeleteTrackingTag.service';
import { GetTrackingTagsService } from './queries/GetTrackingTags.service';
import { GetTrackingTagService } from './queries/GetTrackingTag.service';
import { CreateTrackingTagDto, EditTrackingTagDto } from './dtos/TrackingTag.dto';
import { TrackingTag } from './models/TrackingTag';

@Injectable()
export class TrackingTagsApplication {
  constructor(
    private createService: CreateTrackingTagService,
    private editService: EditTrackingTagService,
    private deleteService: DeleteTrackingTagService,
    private getTagsService: GetTrackingTagsService,
    private getTagService: GetTrackingTagService,
  ) {}

  /**
   * Creates a new tracking tag.
   * @param {CreateTrackingTagDto} dto
   * @returns {Promise<TrackingTag>}
   */
  public createTrackingTag = (dto: CreateTrackingTagDto): Promise<TrackingTag> => {
    return this.createService.createTrackingTag(dto);
  };

  /**
   * Edits a tracking tag.
   * @param {number} tagId
   * @param {EditTrackingTagDto} dto
   * @returns {Promise<TrackingTag>}
   */
  public editTrackingTag = (tagId: number, dto: EditTrackingTagDto): Promise<TrackingTag> => {
    return this.editService.editTrackingTag(tagId, dto);
  };

  /**
   * Deletes a tracking tag.
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  public deleteTrackingTag = (tagId: number): Promise<void> => {
    return this.deleteService.deleteTrackingTag(tagId);
  };

  /**
   * Retrieves all tracking tags.
   * @returns {Promise<TrackingTag[]>}
   */
  public getTrackingTags = (): Promise<TrackingTag[]> => {
    return this.getTagsService.getTrackingTags();
  };

  /**
   * Retrieves a tracking tag by ID.
   * @param {number} tagId
   * @returns {Promise<TrackingTag>}
   */
  public getTrackingTag = (tagId: number): Promise<TrackingTag> => {
    return this.getTagService.getTrackingTag(tagId);
  };
}
