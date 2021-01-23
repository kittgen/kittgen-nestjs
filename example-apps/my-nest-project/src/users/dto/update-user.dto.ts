import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  isActive: boolean;
}
