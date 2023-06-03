import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { AuthServiceMock } from '@modules/auth/tests/mocks/auth.service.mock';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  describe('Define', () => {
    it('Should define the dependencies', async () => {
      expect(authService).toBeDefined();
      expect(strategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('Should throw UnAuthorizedException', async () => {
      await expect(
        strategy.validate('prathamesh@gmail.com', '1234'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        strategy.validate('prathamesh@gmail.com', '1234'),
      ).rejects.toThrow(new UnauthorizedException('Invalid Credentials!'));
    });

    it('Should Validate user', async () => {
      await authService.signUp({
        firstName: 'Shivani',
        lastName: 'Champ',
        email: 'shivani@gmail.com',
        age: 24,
        password: '1234',
      });

      const result = await strategy.validate('shivani@gmail.com', '1234');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('firstName', 'Shivani');
      expect(result).toHaveProperty('lastName', 'Champ');
      expect(result).toHaveProperty('email', 'shivani@gmail.com');
      expect(result).toHaveProperty('role', 'user');
      expect(result).toHaveProperty('age', 24);
    });
  });
});
