import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TrackingTagsApplication } from './TrackingTags.application';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTrackingTagDto,
  EditTrackingTagDto,
} from './dtos/TrackingTag.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';

@Controller('tracking-tags')
@ApiTags('Tracking Tags')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class TrackingTagsController {
  constructor(private readonly trackingTagsApplication: TrackingTagsApplication) {}

  @Post()
  @RequirePermission('Create', AbilitySubject.TrackingTag)
  @ApiOperation({ summary: 'Create a new tracking tag.' })
  @ApiResponse({
    status: 201,
    description: 'The tracking tag has been successfully created.',
  })
  public createTrackingTag(@Body() dto: CreateTrackingTagDto) {
    return this.trackingTagsApplication.createTrackingTag(dto);
  }

  @Put(':id')
  @RequirePermission('Edit', AbilitySubject.TrackingTag)
  @ApiOperation({ summary: 'Edit the given tracking tag.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking tag has been successfully updated.',
  })
  public editTrackingTag(
    @Param('id') tagId: number,
    @Body() dto: EditTrackingTagDto,
  ) {
    return this.trackingTagsApplication.editTrackingTag(tagId, dto);
  }

  @Delete(':id')
  @RequirePermission('Delete', AbilitySubject.TrackingTag)
  @ApiOperation({ summary: 'Delete the given tracking tag.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking tag has been successfully deleted.',
  })
  public deleteTrackingTag(@Param('id') tagId: number) {
    return this.trackingTagsApplication.deleteTrackingTag(tagId);
  }

  @Get()
  @RequirePermission('View', AbilitySubject.TrackingTag)
  @ApiOperation({ summary: 'Retrieves all tracking tags.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking tags have been successfully retrieved.',
  })
  public getTrackingTags() {
    return this.trackingTagsApplication.getTrackingTags();
  }

  @Get(':id')
  @RequirePermission('View', AbilitySubject.TrackingTag)
  @ApiOperation({ summary: 'Retrieves the tracking tag details.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking tag details have been successfully retrieved.',
  })
  public getTrackingTag(@Param('id') tagId: number) {
    return this.trackingTagsApplication.getTrackingTag(tagId);
  }
}
