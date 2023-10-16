import {
    IsOptional,
    IsString,
    IsInt,
} from 'class-validator';

export class EditResultDto{
    @IsOptional()
    @IsInt()
    ia_score: number;

    @IsOptional()
    @IsString()
    ia_result: string;

    @IsOptional()
    @IsInt()
    ai_id: number;

    @IsOptional()
    @IsInt()
    document_id: number;
}
