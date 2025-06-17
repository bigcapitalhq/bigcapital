import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetResourceViewsService } from './GetResourceViews.service';
import { ViewResponseDto } from './dtos/ViewResponse.dto';

@Controller('views')
@ApiTags('Views')
@ApiExtraModels(ViewResponseDto)
export class ViewsController {
  constructor(
    private readonly getResourceViewsService: GetResourceViewsService,
  ) {}

  @Get('/resource/:resourceModel')
  @ApiParam({
    name: 'resourceModel',
    description: 'The resource model to get views for',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Specific resource views',
    schema: { $ref: getSchemaPath(ViewResponseDto) },
  })
  @ApiOperation({ summary: 'Get the given resource views' })
  async getResourceViews(@Param('resourceModel') resourceModel: string) {
    const views =
      await this.getResourceViewsService.getResourceViews(resourceModel);
    return views;
  }
}
