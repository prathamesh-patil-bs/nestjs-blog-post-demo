import { Post } from 'src/posts/post.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Post, (post) => post.comments, { eager: false })
  @JoinColumn({ name: 'post_id' })
  postId: Post;

  @ManyToOne(() => User, (user) => user.comments, { eager: false })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
