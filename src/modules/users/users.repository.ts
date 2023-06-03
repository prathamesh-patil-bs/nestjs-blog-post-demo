import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from '@modules/users/user.entity';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create({ ...createUserDto });

    return this.save(user);
  }
}
