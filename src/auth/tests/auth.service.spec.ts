import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtHelper } from 'src/utils/jwt.util';
import { RedisUtils } from 'src/utils/redis.util';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/util.module';
import { DataSource } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtHelper: JwtHelper;
  let redisUtils: RedisUtils;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, UtilsModule],
      providers: [
        UsersService,
        ConfigService,
        JwtHelper,
        RedisUtils,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtHelper = module.get<JwtHelper>(JwtHelper);
    redisUtils = module.get<RedisUtils>(RedisUtils);
  });

  describe('Define', () => {
    it('Should define the all dependencies.', async () => {
      expect(authService).toBeDefined();
      expect(userService).toBeDefined();
      expect(jwtHelper).toBeDefined();
      expect(redisUtils).toBeDefined();
    });
  });
});
