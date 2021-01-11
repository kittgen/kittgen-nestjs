import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ExposeIfHasPermissionFor } from './expose-if-has-permission-for.decorator';

export class GetArticleDto {
  @ExposeIfHasPermissionFor('read-article')
  @IsString()
  name: string;

  @ExposeIfHasPermissionFor('write-article')
  @IsBoolean()
  published: boolean;

  @IsNumber()
  authorId: number;

  constructor(props: Partial<GetArticleDto>) {
    Object.assign(this, props);
  }
}
