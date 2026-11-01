import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceMetadataDto {
  @ApiProperty() name: string;
  @ApiProperty() baseCurrency: string;
  @ApiPropertyOptional() industry?: string;
  @ApiPropertyOptional() location?: string;
  @ApiPropertyOptional() timezone?: string;
  @ApiPropertyOptional() language?: string;
  @ApiPropertyOptional() logoKey?: string;
  @ApiPropertyOptional() logoUri?: string;
}

export class WorkspaceDto {
  @ApiProperty() organizationId: string;
  @ApiProperty() isReady: boolean;
  @ApiProperty() isBuildRunning: boolean;
  @ApiProperty() isDeleting: boolean;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional() buildJobId?: string;
  @ApiProperty() role: 'owner' | 'member';
  @ApiPropertyOptional() isDefault?: boolean;
  @ApiPropertyOptional({ type: WorkspaceMetadataDto })
  metadata?: WorkspaceMetadataDto;
  @ApiPropertyOptional() totalIncome?: number;
  @ApiPropertyOptional() totalExpenses?: number;
  @ApiPropertyOptional() totalAssets?: number;
  @ApiPropertyOptional() totalLiabilities?: number;
  @ApiPropertyOptional() formattedTotalAssets?: string;
  @ApiPropertyOptional() formattedTotalLiabilities?: string;
}

export class CreateWorkspaceResponseDto {
  @ApiProperty() organizationId: string;
  @ApiProperty() jobId: string;
}
