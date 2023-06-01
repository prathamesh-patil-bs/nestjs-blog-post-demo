import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepository } from '../users.repository';
import { UserRepositoryMock } from './mocks/user.repository.mock';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { TCurrentUser } from '../types/current-user.type';

describe('UserService', () => {
  let service: UsersService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('Define', () => {
    it('Should define the UserService', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('createUser', () => {
    it('Should create user', async () => {
      const createUserDto = {
        firstName: 'parth',
        lastName: 'patel',
        age: 25,
        email: 'parth@gmail.com',
        password: 'parth123',
      };

      const user = await service.createUser(createUserDto);
      expect(user).toBeDefined();
    });

    it('Should not create the user', async () => {
      const parth = {
        firstName: 'parth',
        lastName: 'patel',
        age: 25,
        email: 'parth@gmail.com',
        password: 'parth123',
      };

      const prathamesh = {
        firstName: 'prathamesh',
        lastName: 'patil',
        age: 25,
        email: 'parth@gmail.com',
        password: 'pratham123',
      };

      // Create first user
      await service.createUser(parth);

      // Trying to create user with existing email.
      await expect(service.createUser(prathamesh)).rejects.toThrow(
        new ConflictException(
          `User with email "${parth.email}" already exists!`,
        ),
      );
    });
  });

  describe('fetchUsers', () => {
    it('Should return the empty list if there is no usres', async () => {
      const users = await service.fetchUsers();
      expect(users).not.toBeNull();
      expect(users).toHaveLength(0);
    });

    it('Should return a list of users', async () => {
      // Insert user in application
      await service.createUser({
        firstName: 'parth',
        lastName: 'patel',
        age: 25,
        email: 'parth@gmail.com',
        password: 'parth123',
      });
      const users = await service.fetchUsers();
      expect(users).not.toBeNull();
      expect(users).not.toHaveLength(0);
      expect(users[0]).toHaveProperty('firstName', 'parth');
    });
  });

  describe('findUserById', () => {
    it('should not find the user with id 1', async () => {
      const user = await service.findUserById(1);
      expect(user).toBeNull();
    });

    it('should find the user with id 1', async () => {
      await service.createUser({
        firstName: 'parth',
        lastName: 'patel',
        age: 25,
        email: 'parth@gmail.com',
        password: 'parth123',
      });

      const user = await service.findUserById(1);
      expect(user).not.toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should not find the user with email : parth@gmail.com', async () => {
      const user = await service.findUserByEmail('parth@gmail.com');
      expect(user).toBeNull();
    });

    it('should find the user with email : parth@gmail.com 1', async () => {
      await service.createUser({
        firstName: 'parth',
        lastName: 'patel',
        age: 25,
        email: 'parth@gmail.com',
        password: 'parth123',
      });

      const user = await service.findUserByEmail('parth@gmail.com');
      expect(user).not.toBeNull();
    });
  });

  describe('saveUser', () => {
    it('Should save user to database', async () => {
      const user = await service.saveUser(
        new User({
          firstName: 'Prathamesh',
          lastName: 'Patil',
          email: 'pratham@gmail.com',
          age: 24,
        }),
      );

      expect(user).toBeDefined();
      expect(user).toHaveProperty('firstName', 'Prathamesh');
      expect(user).toHaveProperty('lastName', 'Patil');
      expect(user).toHaveProperty('email', 'pratham@gmail.com');
      expect(user).toHaveProperty('age', 24);
    });
  });

  describe('updateUser', () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      firstName: 'Prathamesh',
      lastName: 'Patil',
      age: 24,
      email: 'pratham@gmail.com',
    };

    it('should throw user not found error', async () => {
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        new NotFoundException(`No such user found with 1 id.`),
      );
    });

    it('should update the user details', async () => {
      const prathamesh = {
        firstName: 'prathamesh',
        lastName: 'patil',
        age: 25,
        email: 'parth@gmail.com',
        password: 'pratham123',
      };

      const user = await service.createUser(prathamesh);
      const updatedUser = await service.updateUser(1, updateUserDto);

      expect(updatedUser).not.toHaveProperty('age', prathamesh.age);
      expect(updatedUser).not.toHaveProperty('email', user.email);
      expect(updatedUser).toHaveProperty('id', 1);
    });
  });

  describe('deleteUser', () => {
    const currentUser: TCurrentUser = {
      id: 1,
      firstName: 'Prathamesh',
      lastName: 'Patil',
      role: 'user',
      email: 'pratham@gmail.com',
    };

    const inputUserData = {
      id: 2,
      firstName: 'parth',
      lastName: 'patel',
      age: 25,
      email: 'parth@gmail.com',
      password: 'parth123',
    };

    it('Should throw NotFoundException for wrong user id', async () => {
      await expect(service.deleteUser(currentUser, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteUser(currentUser, 1)).rejects.toThrow(
        new NotFoundException(`No such user found with id : 1`),
      );
    });

    it('Should Throw UnAuthorized Exception', async () => {
      await service.createUser(inputUserData);
      await expect(service.deleteUser(currentUser, 2)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.deleteUser(currentUser, 2)).rejects.toThrow(
        new UnauthorizedException(
          `You don't have sufficient access to delete this user.`,
        ),
      );
    });

    it(`Should delete the user`, async () => {
      currentUser.role = 'admin';
      await service.createUser(inputUserData);
      const result = await service.deleteUser(currentUser, 2);

      expect(result).toHaveProperty('message', 'User delete successfully.');
    });
  });
});
