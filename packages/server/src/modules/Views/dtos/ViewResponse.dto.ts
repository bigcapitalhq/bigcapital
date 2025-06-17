import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn } from '../models/ViewColumn.model';
import { RoleResponseDto } from './RoleResponse.dto';

export class ViewResponseDto {
  @ApiProperty({ description: 'The unique identifier of the view' })
  id: number;

  @ApiProperty({ description: 'The name of the view' })
  name: string;

  @ApiProperty({ description: 'The slug of the view' })
  slug: string;

  @ApiProperty({ description: 'Whether the view is predefined' })
  predefined: boolean;

  @ApiProperty({ description: 'The resource model associated with the view' })
  resourceModel: string;

  @ApiProperty({ description: 'Whether the view is marked as favourite' })
  favourite: boolean;

  @ApiProperty({ description: 'The roles logic expression for the view' })
  rolesLogicExpression: string;

  @ApiProperty({
    type: [RoleResponseDto],
    description: 'The roles associated with the view',
  })
  roles: RoleResponseDto[];

  @ApiProperty({
    type: [ViewColumn],
    description: 'The columns associated with the view',
  })
  columns: ViewColumn[];

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp' })
  updatedAt: Date;
}
