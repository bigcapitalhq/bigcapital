import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BranchesApplication } from './BranchesApplication.service';
import { CreateBranchDto, EditBranchDto } from './dtos/Branch.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BranchResponseDto } from './dtos/BranchResponse.dto';

@Controller('branches')
@ApiTags('Branches')
@ApiExtraModels(BranchResponseDto)
export class BranchesController {
  constructor(private readonly branchesApplication: BranchesApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves the branches.' })
  @ApiResponse({
    status: 200,
    description: 'The branches have been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(BranchResponseDto),
      },
    },
  })
  getBranches() {
    return this.branchesApplication.getBranches();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the branch details.' })
  @ApiResponse({
    status: 200,
    description: 'The branch details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(BranchResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The branch not found.' })
  getBranch(@Param('id') id: string) {
    return this.branchesApplication.getBranch(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new branch.' })
  @ApiResponse({
    status: 200,
    description: 'The branch has been successfully created.',
    schema: {
      $ref: getSchemaPath(BranchResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The branch not found.' })
  createBranch(@Body() createBranchDTO: CreateBranchDto) {
    return this.branchesApplication.createBranch(createBranchDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given branch.' })
  @ApiResponse({
    status: 200,
    description: 'The branch has been successfully edited.',
    schema: {
      $ref: getSchemaPath(BranchResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The branch not found.' })
  editBranch(@Param('id') id: string, @Body() editBranchDTO: EditBranchDto) {
    return this.branchesApplication.editBranch(Number(id), editBranchDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given branch.' })
  @ApiResponse({
    status: 200,
    description: 'The branch has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The branch not found.' })
  deleteBranch(@Param('id') id: string) {
    return this.branchesApplication.deleteBranch(Number(id));
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate the branches feature.' })
  @ApiResponse({
    status: 200,
    description: 'The branches feature has been successfully activated.',
  })
  async activateBranches() {
    await this.branchesApplication.activateBranches();

    return {
      code: 200,
      message: 'The branches activated successfully.',
    };
  }

  @Put(':id/mark-as-primary')
  @ApiOperation({ summary: 'Mark the given branch as primary.' })
  @ApiResponse({
    status: 200,
    description: 'The branch has been successfully marked as primary.',
    schema: {
      $ref: getSchemaPath(BranchResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The branch not found.' })
  markBranchAsPrimary(@Param('id') id: string) {
    return this.branchesApplication.markBranchAsPrimary(Number(id));
  }
}
