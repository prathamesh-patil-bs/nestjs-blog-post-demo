import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  describe('Define', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      firstName: 'parth',
      lastName: 'patel',
      age: 25,
      email: 'parth@gmail.com',
      password: 'parth123',
    };

    const user = new User({
      id: 3,
      firstName: 'shivani',
      lastName: 'patil',
      email: 'shivani@gmail.com',
      age: 25,
      role: 'user',
      createdAt: new Date('2023-05-10T12:51:04.696Z'),
      updatedAt: new Date('2023-05-10T12:51:04.696Z'),
    });

    it('should create a user', async () => {
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => user);

      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(Promise.resolve(user as User));

      const createdUser = await repository.createUser(createUserDto);

      expect(createdUser).not.toBeNull();
      expect(createdUser).toEqual(user);
      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith(createUserDto);
      expect(saveSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalledWith(user);
    });
  });
});
