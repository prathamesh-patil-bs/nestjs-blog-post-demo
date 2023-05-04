import { Expose } from 'class-transformer';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  text: string;

  @Expose()
  title: string;

  @Expose()
  authorId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
