import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ description: 'The unique identifier of the role' })
  id: number;

  @ApiProperty({ description: 'The index of the role' })
  index: number;

  @ApiProperty({ description: 'The field key associated with the role' })
  fieldKey: string;

  @ApiProperty({
    description:
      'The comparator used for the role (equals, not_equal, contains, not_contain)',
  })
  comparator: string;

  @ApiProperty({ description: 'The value to compare against' })
  value: string;

  @ApiProperty({ description: 'The ID of the view this role belongs to' })
  viewId: number;

  @ApiProperty({ description: 'The creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp' })
  updatedAt: Date;
}
