import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceBuildJobResponseDto {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 'active' })
  state: string;

  @ApiProperty({ example: 50 })
  progress: number | Record<string, unknown>;

  @ApiProperty({ example: false })
  isCompleted: boolean;

  @ApiProperty({ example: true })
  isRunning: boolean;

  @ApiProperty({ example: false })
  isWaiting: boolean;

  @ApiProperty({ example: false })
  isFailed: boolean;
}
