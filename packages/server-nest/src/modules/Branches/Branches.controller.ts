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
import { ICreateBranchDTO, IEditBranchDTO } from './Branches.types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('branches')
@ApiTags('branches')
@PublicRoute()
export class BranchesController {
  constructor(private readonly branchesApplication: BranchesApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves the branches.' })
  getBranches() {
    return this.branchesApplication.getBranches();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the branch details.' })
  getBranch(@Param('id') id: string) {
    return this.branchesApplication.getBranch(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new branch.' })
  createBranch(@Body() createBranchDTO: ICreateBranchDTO) {
    return this.branchesApplication.createBranch(createBranchDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given branch.' })
  editBranch(@Param('id') id: string, @Body() editBranchDTO: IEditBranchDTO) {
    return this.branchesApplication.editBranch(Number(id), editBranchDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given branch.' })
  deleteBranch(@Param('id') id: string) {
    return this.branchesApplication.deleteBranch(Number(id));
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate the branches feature.' })
  activateBranches() {
    return this.branchesApplication.activateBranches();
  }

  @Put(':id/mark-as-primary')
  @ApiOperation({ summary: 'Mark the given branch as primary.' })
  markBranchAsPrimary(@Param('id') id: string) {
    return this.branchesApplication.markBranchAsPrimary(Number(id));
  }
}
