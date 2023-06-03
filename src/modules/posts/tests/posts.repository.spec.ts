import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { PostRepository } from '@modules/posts/posts.repository';

describe('PostsRepository', () => {
  let repository: PostRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = module.get<PostRepository>(PostRepository);
  });

  describe('Define', () => {
    it('Should define the PostRepository', () => {
      expect(repository).toBeDefined();
    });
  });
});
