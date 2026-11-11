import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ManualJournalResponseDto } from '@/modules/ManualJournals/dtos/ManualJournalResponse.dto';
import { RecurringJournalsApplication } from './RecurringJournals.application';
import {
  CreateRecurringJournalDto,
  EditRecurringJournalDto,
} from './dtos/RecurringJournal.dto';
import { GetRecurringJournalsQueryDto } from './dtos/GetRecurringJournalsQuery.dto';
import { GetRecurringJournalJournalsQueryDto } from './dtos/GetRecurringJournalJournalsQuery.dto';
import { RecurringJournalResponseDto } from './dtos/RecurringJournalResponse.dto';
import { RecurringJournalAction } from './RecurringJournal.types';
import { RecurringJournalsFeatureGuard } from './RecurringJournalsFeatureGuard';

@Controller('recurring-journals')
@ApiTags('Recurring Journals')
@ApiCommonHeaders()
@ApiExtraModels(RecurringJournalResponseDto)
@ApiExtraModels(ManualJournalResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@UseGuards(AuthorizationGuard, PermissionGuard, RecurringJournalsFeatureGuard)
export class RecurringJournalsController {
  constructor(
    private readonly recurringJournalsApplication: RecurringJournalsApplication,
  ) {}

  @Post()
  @RequirePermission(
    RecurringJournalAction.Create,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Creates a new recurring journal profile.' })
  @ApiBody({ type: CreateRecurringJournalDto })
  @ApiResponse({
    status: 201,
    description: 'The recurring journal has been created.',
    type: RecurringJournalResponseDto,
  })
  createRecurringJournal(
    @Body() recurringJournalDTO: CreateRecurringJournalDto,
  ) {
    return this.recurringJournalsApplication.createRecurringJournal(
      recurringJournalDTO,
    );
  }

  @Get()
  @RequirePermission(
    RecurringJournalAction.View,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Retrieves recurring journal profiles.' })
  @ApiResponse({
    status: 200,
    description: 'The recurring journals have been retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(RecurringJournalResponseDto) },
            },
          },
        },
      ],
    },
  })
  getRecurringJournals(@Query() filterDTO: GetRecurringJournalsQueryDto) {
    return this.recurringJournalsApplication.getRecurringJournals(filterDTO);
  }

  @Get(':id')
  @RequirePermission(
    RecurringJournalAction.View,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Retrieves the given recurring journal.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring journal has been retrieved.',
    type: RecurringJournalResponseDto,
  })
  getRecurringJournal(@Param('id', ParseIntPipe) id: number) {
    return this.recurringJournalsApplication.getRecurringJournal(id);
  }

  @Put(':id')
  @RequirePermission(
    RecurringJournalAction.Edit,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Edits the given recurring journal.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({ type: EditRecurringJournalDto })
  @ApiResponse({
    status: 200,
    description: 'The recurring journal has been updated.',
    type: RecurringJournalResponseDto,
  })
  editRecurringJournal(
    @Param('id', ParseIntPipe) id: number,
    @Body() recurringJournalDTO: EditRecurringJournalDto,
  ) {
    return this.recurringJournalsApplication.editRecurringJournal(
      id,
      recurringJournalDTO,
    );
  }

  @Delete(':id')
  @RequirePermission(
    RecurringJournalAction.Delete,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Deletes the given recurring journal.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring journal has been deleted.',
  })
  deleteRecurringJournal(@Param('id', ParseIntPipe) id: number) {
    return this.recurringJournalsApplication.deleteRecurringJournal(id);
  }

  @Post(':id/pause')
  @RequirePermission(
    RecurringJournalAction.Edit,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Pauses the given recurring journal.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring journal has been paused.',
    type: RecurringJournalResponseDto,
  })
  @HttpCode(200)
  pauseRecurringJournal(@Param('id', ParseIntPipe) id: number) {
    return this.recurringJournalsApplication.pauseRecurringJournal(id);
  }

  @Post(':id/resume')
  @RequirePermission(
    RecurringJournalAction.Edit,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({ summary: 'Resumes the given recurring journal.' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The recurring journal has been resumed.',
    type: RecurringJournalResponseDto,
  })
  @HttpCode(200)
  resumeRecurringJournal(@Param('id', ParseIntPipe) id: number) {
    return this.recurringJournalsApplication.resumeRecurringJournal(id);
  }

  @Post(':id/generate')
  @RequirePermission(
    RecurringJournalAction.Edit,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({
    summary: 'Generates a journal immediately without rescheduling.',
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The journal has been generated.',
    type: ManualJournalResponseDto,
  })
  @HttpCode(200)
  generateRecurringJournal(@Param('id', ParseIntPipe) id: number) {
    return this.recurringJournalsApplication.generateNow(id);
  }

  @Get(':id/journals')
  @RequirePermission(
    RecurringJournalAction.View,
    AbilitySubject.RecurringJournal,
  )
  @ApiOperation({
    summary: 'Retrieves the journals generated by the recurring profile.',
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The generated journals have been retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ManualJournalResponseDto) },
            },
          },
        },
      ],
    },
  })
  getRecurringJournalJournals(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetRecurringJournalJournalsQueryDto,
  ) {
    return this.recurringJournalsApplication.getRecurringJournalJournals(
      id,
      query,
    );
  }
}
