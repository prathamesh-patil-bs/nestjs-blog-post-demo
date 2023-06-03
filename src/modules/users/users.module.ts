import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@modules/users/user.entity';
import { PostsModule } from '@modules/posts/posts.module';
import { UsersService } from '@modules/users/users.service';
import { UserRepository } from '@modules/users/users.repository';
import { UsersController } from '@modules/users/users.controller';
import { CommentsModule } from '@modules/comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PostsModule, CommentsModule],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
