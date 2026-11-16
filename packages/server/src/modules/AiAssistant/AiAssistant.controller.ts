import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { SkipSerialize } from '@/common/decorators/SkipSerialize.decorator';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AiAccessGuard } from './AiAccess.guard';
import { AiAssistantService } from './AiAssistant.service';
import { ChatRequestDto } from './dtos/chat.dto';

@Controller('ai')
@ApiExcludeController()
@SkipSerialize()
@UseGuards(AuthorizationGuard)
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  /**
   * Returns whether the assistant is configured and the user has access.
   */
  @Get('status')
  public getStatus(@Req() req: Request) {
    return this.aiAssistantService.getStatus((req as any).ability);
  }

  /**
   * Streams an assistant response using the AI SDK UI message protocol.
   */
  @Post('chat')
  @UseGuards(AiAccessGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  public async chat(
    @Body() dto: ChatRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const abortController = new AbortController();
    res.on('close', () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    });

    const stream = await this.aiAssistantService.streamChat({
      conversationId: dto.conversationId,
      messages: dto.messages,
      trigger: dto.trigger ?? 'submit-message',
      messageId: dto.messageId,
      ability: (req as any).ability,
      abortSignal: abortController.signal,
    });

    await stream.result.pipeUIMessageStreamToResponse(res, {
      originalMessages: stream.originalMessages,
      messageMetadata: stream.messageMetadata,
      onFinish: stream.onFinish,
      onError: stream.onError,
      keepAliveMs: 15000,
      headers: {
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  }
}
