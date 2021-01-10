import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class CreateHelloDto {
    @IsString()
    name: string;

    @IsBoolean()
    published: boolean;

    @IsNumber()
    authorId: number;
}
