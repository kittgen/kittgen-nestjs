import { ExposeWithPermission } from '@kittgen/nestjs-authorization';
import { IsBoolean, IsString } from 'class-validator';
import { UserAction } from '../actions';

export class GetUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  @ExposeWithPermission(UserAction.CanEdit)
  isActive: boolean;
}
