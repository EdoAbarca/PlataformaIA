import {
    IsOptional,
    IsString,
} from 'class-validator';

export class EditDocumentDto {
    @IsString()
    @IsOptional()
    title: string;
}