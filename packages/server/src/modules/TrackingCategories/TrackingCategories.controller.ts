import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { TrackingCategoriesApplication } from './TrackingCategoriesApplication.service';
import {
  CreateTrackingCategoryDto,
  EditTrackingCategoryDto,
} from './dtos/TrackingCategory.dto';
import { TrackingCategoryResponseDto } from './dtos/TrackingCategoryResponse.dto';

@Controller('tracking-categories')
@ApiTags('Tracking Categories')
@ApiExtraModels(TrackingCategoryResponseDto)
@ApiCommonHeaders()
export class TrackingCategoriesController {
  constructor(
    private readonly trackingCategoriesApplication: TrackingCategoriesApplication,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves all tracking categories.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking categories have been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(TrackingCategoryResponseDto),
      },
    },
  })
  public getTrackingCategories() {
    return this.trackingCategoriesApplication.getTrackingCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the tracking category details.' })
  @ApiResponse({
    status: 200,
    description:
      'The tracking category details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(TrackingCategoryResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The tracking category not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The tracking category id',
  })
  public getTrackingCategory(@Param('id') categoryId: number) {
    return this.trackingCategoriesApplication.getTrackingCategory(
      Number(categoryId),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new tracking category.' })
  @ApiResponse({
    status: 201,
    description: 'The tracking category has been successfully created.',
    schema: {
      $ref: getSchemaPath(TrackingCategoryResponseDto),
    },
  })
  public createTrackingCategory(@Body() dto: CreateTrackingCategoryDto) {
    return this.trackingCategoriesApplication.createTrackingCategory(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edits the given tracking category.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking category has been successfully updated.',
    schema: {
      $ref: getSchemaPath(TrackingCategoryResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The tracking category not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The tracking category id',
  })
  public editTrackingCategory(
    @Param('id') categoryId: number,
    @Body() dto: EditTrackingCategoryDto,
  ) {
    return this.trackingCategoriesApplication.editTrackingCategory(
      Number(categoryId),
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes the given tracking category.' })
  @ApiResponse({
    status: 200,
    description: 'The tracking category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The tracking category not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The tracking category id',
  })
  public deleteTrackingCategory(@Param('id') categoryId: number) {
    return this.trackingCategoriesApplication.deleteTrackingCategory(
      Number(categoryId),
    );
  }
}
