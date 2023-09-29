import {
    IsOptional,
    IsString,
} from 'class-validator';

export class EditAnalysisDto {
    @IsString()
    @IsOptional()
    title: string;
}