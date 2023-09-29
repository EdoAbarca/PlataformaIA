import {
    IsNotEmpty,
    IsString,
    IsInt,
} from 'class-validator';

export class CreateKeyDto {
    @IsString()
    @IsNotEmpty()
    ai_key: string;

    @IsInt()
    @IsNotEmpty()
    ai_id: number;
}