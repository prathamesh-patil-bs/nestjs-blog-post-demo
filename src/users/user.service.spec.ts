import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UserService', () => {
  let service: UsersService;

  const fakeUserService = {};
  const fakeUserRepository = {
    createUser: (createUserDto: CreateUserDto) => {
      return createUserDto;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: UserRepository,
          useValue: fakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('Define', () => {
    it('Should define the UserService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('', () => {
    return;
  });
});
