import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetResourceViewsService } from './GetResourceViews.service';

@Controller('views')
@ApiTags('Views')
export class ViewsController {
  constructor(
    private readonly getResourceViewsService: GetResourceViewsService,
  ) {}

  @Get('/resource/:resourceModel')
  @ApiResponse({ status: 200, description: 'Specific resource views' })
  @ApiOperation({ summary: 'Get the given resource views' })
  async getResourceViews(@Param('resourceModel') resourceModel: string) {
    const views =
      await this.getResourceViewsService.getResourceViews(resourceModel);
    return { views };
  }
}
