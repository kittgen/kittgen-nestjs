import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ExposeWithPermission } from '@kittgen/nestjs-authorization';

export class GetArticleDto {
  @ExposeWithPermission('read-article')
  @IsString()
  name: string;

  @ExposeWithPermission('write-article')
  @IsBoolean()
  published: boolean;

  @IsNumber()
  authorId: number;

  constructor(props: Partial<GetArticleDto>) {
    Object.assign(this, props);
  }
}
