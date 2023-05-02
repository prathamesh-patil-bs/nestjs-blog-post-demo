import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostRepository } from './posts.repository';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { TCurrentUser } from 'src/users/types/current-user.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: PostRepository,
  ) {}

  fetchAllPosts() {
    return this.postsRepository.find();
  }

  fetchPostById(postId: number) {
    return this.postsRepository.findOneBy({ id: postId });
  }

  createPost(user: TCurrentUser, createPostDto: CreatePostDto) {
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    return this.postsRepository.save(post);
  }

  // updatePost() {}

  // deletePost() {}
}
