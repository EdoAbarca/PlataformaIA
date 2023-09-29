import {
    IsOptional,
    IsString,
} from 'class-validator';

export class EditKeyDto {
    @IsString()
    @IsOptional()
    ai_key: string;
}