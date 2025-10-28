import { Controller, Get, Param } from '@nestjs/common';
import { GetResourceViewsService } from '../Views/GetResourceViews.service';
import { ResourceService } from './ResourceService';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('resources')
@ApiTags('resources')
export class ResourceController {
  constructor(private readonly resourcesService: ResourceService) {}

  @Get('/:resourceModel/meta')
  @ApiResponse({ status: 200, description: 'Retrieves the resource meta' })
  @ApiOperation({ summary: 'Retrieves the resource meta' })
  getResourceMeta(@Param('resourceModel') resourceModel: string) {
    const resourceMeta = this.resourcesService.getResourceMeta(resourceModel);

    return {
      resourceMeta,
    };
  }
}
