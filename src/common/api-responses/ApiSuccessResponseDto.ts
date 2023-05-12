import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponseDto {
  @ApiProperty({
    description: 'Success Response',
    examples: [
      'Comment deleted successfully.',
      'Post deleted successfully',
      'User delete successfully.',
    ],
  })
  message: string;
}
