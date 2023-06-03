import {
  Column,
  Entity,
  OneToMany,
  DeepPartial,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash, compare } from 'bcrypt';

import { USER_ROLE } from '@common/app.constants';
import { Post } from '@modules/posts/post.entity';
import { Comment } from '@modules/comments/comment.entity';

@Entity({ name: 'users' })
export class User {
  constructor(obj: DeepPartial<User>) {
    return Object.assign(this, obj);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER })
  role: string;

  @OneToMany(() => Post, (post) => post.author, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.userId, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  validatePassword(password: string) {
    return compare(password, this.password);
  }
}
