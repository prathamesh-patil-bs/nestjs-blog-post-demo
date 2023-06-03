import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeepPartial,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from 'src/modules/comments/comment.entity';
import { User } from 'src/modules/users/user.entity';

@Entity({ name: 'posts' })
export class Post {
  constructor(entityLike: DeepPartial<Post>) {
    return Object.assign(this, entityLike);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ nullable: true, name: 'author_id' })
  authorId: number;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.postId, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
