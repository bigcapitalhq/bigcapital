import { ApiProperty } from '@nestjs/swagger';
import { IsIn, ValidateIf } from 'class-validator';
import { AiMessageFeedback } from '../AiAssistant.types';

export class SetMessageFeedbackDto {
  /**
   * The rating of an assistant message. `null` clears an existing rating;
   * omitting the property is rejected.
   */
  @ApiProperty({
    enum: ['like', 'dislike'],
    nullable: true,
    description: "'like', 'dislike' or null to clear the rating.",
  })
  @ValidateIf((dto: SetMessageFeedbackDto) => dto.feedback !== null)
  @IsIn(['like', 'dislike'])
  feedback: AiMessageFeedback | null;
}
