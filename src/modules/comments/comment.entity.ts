import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  DeepPartial,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from '@modules/posts/post.entity';
import { User } from '@modules/users/user.entity';

@Entity({ name: 'comments' })
export class Comment {
  constructor(obj: DeepPartial<Comment>) {
    return Object.assign(this, obj);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ nullable: true, name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
