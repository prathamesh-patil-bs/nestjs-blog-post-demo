import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceMock } from './mocks/config.service.mock';
import { UsersService } from 'src/users/users.service';
import { UserServiceMock } from 'src/users/tests/mocks/user.service.mock';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: UsersService,
          useClass: UserServiceMock,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it("Should return false if user doesn't exists in system", async () => {
      const result = await strategy.validate({
        userId: 1,
        iat: 2564,
        exp: 12345,
        iss: 'string',
        sub: 'string',
        aud: 'string',
      });

      expect(result).toBeDefined();
      expect(result).toEqual(false);
      expect(result).toBeFalsy();
    });
  });
});
