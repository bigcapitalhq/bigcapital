import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrackingTagOptionDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Option ID (for updates)', required: false })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Option name', example: 'New York' })
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the option is active', required: false, example: true })
  active?: boolean = true;
}

export class CreateTrackingTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Tag name', example: 'Location' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Tag description', required: false, example: 'Business location tracking' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the tag is active', required: false, example: true })
  active?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackingTagOptionDto)
  @ApiProperty({ description: 'Tag options', type: [TrackingTagOptionDto] })
  options: TrackingTagOptionDto[];
}

export class EditTrackingTagDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Tag name', required: false, example: 'Location' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Tag description', required: false, example: 'Business location tracking' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the tag is active', required: false, example: true })
  active?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackingTagOptionDto)
  @IsOptional()
  @ApiProperty({ description: 'Tag options', type: [TrackingTagOptionDto], required: false })
  options?: TrackingTagOptionDto[];
}

export class CreateTrackingTagOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Option name', example: 'New York' })
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the option is active', required: false, example: true })
  active?: boolean = true;
}

export class EditTrackingTagOptionDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Option name', required: false, example: 'New York' })
  name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the option is active', required: false, example: true })
  active?: boolean;
}
