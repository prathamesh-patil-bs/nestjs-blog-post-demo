import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { UpdatePostDto } from './dtos/update-post.dto';
import { USER_ROLE } from 'src/common/app.constants';

@Injectable()
export class PostsService {
  private logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post) private readonly postsRepository: PostRepository,
  ) {}

  fetchPostOfUser(userId: number): Promise<Array<Post>> {
    return this.postsRepository.findBy({ authorId: userId });
  }

  async fetchPostOfUserById(userId: number, postId: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({
      id: postId,
      authorId: userId,
    });

    return post;
  }

  createPost(user: TCurrentUser, createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    return this.postsRepository.save(post);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({
      id: postId,
      authorId: userId,
    });

    if (!post) {
      this.logger.warn("Trying to update post which doesn't exists", {
        userId,
        postId,
      });
      throw new NotFoundException(`No such post found with id : ${postId}`);
    }

    return this.postsRepository.save({ ...post, ...updatePostDto });
  }

  async deletePost(
    user: TCurrentUser,
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const post = await this.fetchPostOfUserById(userId, postId);

    if (!post) {
      this.logger.warn("Trying to delete post which doesn't exists", {
        userId,
        postId,
      });
      throw new NotFoundException(`No such post found with id : ${postId}`);
    }

    const isUserAdmin = user.role === USER_ROLE.ADMIN;
    const isUserOwnsPost = user.id === post.authorId;

    if (!isUserAdmin && !isUserOwnsPost) {
      this.logger.warn('Trying to update post with insufficient access.', {
        userId,
        postId,
      });
      throw new UnauthorizedException();
    }

    await this.postsRepository.delete({ id: postId });

    return { message: 'Post deleted successfully.' };
  }
}
