import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Post } from '@modules/posts/post.entity';
import { PostsService } from '@modules/posts/posts.service';
import { CreatePostDto } from '@modules/posts/dtos/create-post.dto';
import { UpdatePostDto } from '@modules/posts/dtos/update-post.dto';
import { TCurrentUser } from '@modules/users/typings/current-user.type';
import { PostRepositoryMock } from '@modules/posts/tests/mocks/posts.repository.mock';

describe('PostRepository', () => {
  let postService: PostsService;

  const currentUser: TCurrentUser = {
    id: 1,
    firstName: 'prathamesh',
    lastName: 'patil',
    email: 'prathamesh@gmail.com',
    role: 'user',
  };

  const createPostDto: CreatePostDto = {
    text: 'Test Text',
    title: 'Test Title',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          /* 
            Only use when you have injected repository using
            @InjectRepository() decorator
          */
          provide: getRepositoryToken(Post),
          useClass: PostRepositoryMock,
        },
      ],
    }).compile();

    postService = module.get<PostsService>(PostsService);
  });

  describe('Define', () => {
    it('Should Define the dependencies', () => {
      expect(postService).toBeDefined();
    });
  });

  describe('createPost', () => {
    it('Should create new post', async () => {
      const result = await postService.createPost(currentUser, createPostDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('text', 'Test Text');
    });
  });

  describe('fetchPostOfUser', () => {
    it('Should return empty list of posts', async () => {
      const result = await postService.fetchPostOfUser(1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(result).toStrictEqual([]);
    });

    it('Should return list of posts', async () => {
      await postService.createPost(currentUser, createPostDto);
      const result = await postService.fetchPostOfUser(1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('authorId', 1);
      expect(result[0]).toHaveProperty('text', 'Test Text');
      expect(result[0]).toHaveProperty('title', 'Test Title');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
    });
  });

  describe('fetchPostOfUserById', () => {
    it('It should not return post on invalid userId or postId', async () => {
      const post = await postService.fetchPostOfUserById(1, 1);
      expect(post).toBeFalsy();
    });

    it('should return a post found by userId and postId', async () => {
      await postService.createPost(currentUser, createPostDto);
      const post = await postService.fetchPostOfUserById(1, 1);

      expect(post).toBeDefined();
      expect(post).toHaveProperty('id', 1);
      expect(post).toHaveProperty('authorId', 1);
      expect(post).toHaveProperty('text', 'Test Text');
      expect(post).toHaveProperty('title', 'Test Title');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
    });
  });

  describe('updatePost', () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
      text: 'UpdatedText',
    };

    it('Should throw NotFoundException', async () => {
      await expect(postService.updatePost(1, 1, updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(postService.updatePost(1, 1, updatePostDto)).rejects.toThrow(
        new NotFoundException('No such post found with id : 1'),
      );
    });

    it('Should update the post info', async () => {
      await postService.createPost(currentUser, createPostDto);
      const result = await postService.updatePost(1, 1, updatePostDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('authorId', 1);
      expect(result).toHaveProperty('text', 'UpdatedText');
      expect(result).toHaveProperty('title', 'Updated Title');
    });
  });

  describe('deletePost', () => {
    it('Should throw NotFoundException on wrong postId or userId', async () => {
      await expect(postService.deletePost(currentUser, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(postService.deletePost(currentUser, 1, 1)).rejects.toThrow(
        new NotFoundException('No such post found with id : 1'),
      );
    });

    it('Should throw UnAuthorizedException on insufficient access', async () => {
      await postService.createPost(currentUser, createPostDto);

      await expect(
        postService.deletePost({ ...currentUser, id: 2 }, 1, 1),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should delete own post', async () => {
      await postService.createPost(currentUser, createPostDto);
      const result = await postService.deletePost(currentUser, 1, 1);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('message', 'Post deleted successfully.');
    });
  });
});
