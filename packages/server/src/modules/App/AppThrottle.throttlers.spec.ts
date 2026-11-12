import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request = require('supertest');
import { AuthThrottle, getAppThrottlers } from './AppThrottle.throttlers';

@Controller('plain')
class PlainController {
  @Get()
  get() {
    return 'ok';
  }
}

@Controller('auth-class')
@AuthThrottle()
class AuthClassController {
  @Get()
  get() {
    return 'ok';
  }
}

@Controller('auth-route')
class AuthRouteController {
  @Get()
  @AuthThrottle()
  marked() {
    return 'ok';
  }

  @Get('other')
  other() {
    return 'ok';
  }
}

describe('getAppThrottlers', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: getAppThrottlers({
            globalTtl: 60000,
            globalLimit: 5,
            authTtl: 60000,
            authLimit: 2,
          }),
        }),
      ],
      controllers: [PlainController, AuthClassController, AuthRouteController],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const statuses = async (path: string, times: number) => {
    const codes: number[] = [];
    for (let i = 0; i < times; i++) {
      codes.push((await request(app.getHttpServer()).get(path)).status);
    }
    return codes;
  };

  it('limits an unmarked route by the default throttler only', async () => {
    expect(await statuses('/plain', 6)).toEqual([200, 200, 200, 200, 200, 429]);
  });

  it('adds the auth throttler to every route of a marked controller', async () => {
    expect(await statuses('/auth-class', 3)).toEqual([200, 200, 429]);
  });

  it('adds the auth throttler to a marked route, not to its neighbours', async () => {
    expect(await statuses('/auth-route', 3)).toEqual([200, 200, 429]);
    expect(await statuses('/auth-route/other', 3)).toEqual([200, 200, 200]);
  });

  it('sends the auth rate-limit headers on marked routes only', async () => {
    const plain = await request(app.getHttpServer()).get('/plain');
    const marked = await request(app.getHttpServer()).get('/auth-class');

    expect(plain.headers['x-ratelimit-limit']).toBe('5');
    expect(plain.headers['x-ratelimit-limit-auth']).toBeUndefined();
    expect(marked.headers['x-ratelimit-limit-auth']).toBe('2');
  });
});
