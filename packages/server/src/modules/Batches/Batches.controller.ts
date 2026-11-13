import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BatchesApplication } from './BatchesApplication';
import { CreateBatchDto } from './dtos/CreateBatch.dto';
import { EditBatchDto } from './dtos/EditBatch.dto';
import { GetBatchesQueryDto } from './dtos/GetBatchesQuery.dto';
import { GetAvailableBatchesQueryDto } from './dtos/GetAvailableBatchesQuery.dto';

@Controller('batches')
@ApiTags('Batches')
@ApiCommonHeaders()
export class BatchesController {
  constructor(private readonly batchesApplication: BatchesApplication) {}

  @Get('/')
  @ApiOperation({ summary: 'Retrieves the batches list' })
  public list(@Query() query: GetBatchesQueryDto) {
    return this.batchesApplication.list(query);
  }

  @Get('/available')
  @ApiOperation({ summary: 'Retrieves the available batches of an item' })
  public available(@Query() query: GetAvailableBatchesQueryDto) {
    return this.batchesApplication.available(query.itemId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieves the given batch' })
  public get(@Param('id', ParseIntPipe) id: number) {
    return this.batchesApplication.get(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Creates a new batch' })
  public create(@Body() dto: CreateBatchDto) {
    return this.batchesApplication.create(dto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Updates the given batch' })
  public edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBatchDto,
  ) {
    return this.batchesApplication.edit(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes the given batch' })
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.batchesApplication.delete(id);
  }
}
