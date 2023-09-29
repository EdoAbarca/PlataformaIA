import {
    IsOptional,
    IsString,
} from 'class-validator';

export class EditAIDto {
    @IsString()
    @IsOptional()
    name?: string;
}