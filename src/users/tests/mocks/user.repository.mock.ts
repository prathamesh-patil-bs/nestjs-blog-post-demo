import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { User } from '../../user.entity';
import { CreateUserDto } from '../../dtos/create-user.dto';

export class UserRepositoryMock {
  users: User[] = [];

  create(entityLike: DeepPartial<User>) {
    entityLike.id = entityLike.id || 1;
    entityLike.createdAt = new Date();
    entityLike.updatedAt = new Date();

    const user = new User(entityLike);
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const user = this.create({ ...createUserDto });
    return this.save(user);
  }

  async save(entity: User) {
    this.users.push(entity);
    return Promise.resolve(entity);
  }

  async countBy(where: FindOptionsWhere<User>) {
    const { email } = where;
    return this.users.filter((user) => user.email === email).length;
  }

  async find(options?: FindManyOptions<User>) {
    return this.users;
  }

  async findOneBy({ id, email }: FindOptionsWhere<User>) {
    if (id && !email) {
      return this.users.filter((user) => user.id === id)[0] ?? null;
    }

    if (email && !id) {
      return this.users.filter((user) => user.email === email)[0] ?? null;
    }
  }

  async delete({ id }: FindOptionsWhere<User>) {
    return this.users.filter((user) => user.id === id);
  }
}
