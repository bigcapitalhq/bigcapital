import { ApiProperty } from '@nestjs/swagger';

/**
 * Response returned by item create/edit/activate endpoints.
 */
export class ItemActionResponseDto {
  @ApiProperty({ description: 'The item id', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The response message',
    example: 'The item has been successfully created.',
  })
  message: string;
}
