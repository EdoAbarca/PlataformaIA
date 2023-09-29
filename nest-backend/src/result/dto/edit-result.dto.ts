import {
    IsOptional,
    IsString,
    IsInt,
} from 'class-validator';

export class EditResultDto{
    @IsInt()
    @IsOptional()
    ia_score: number;

    @IsString()
    @IsOptional()
    ia_result: string;

    @IsInt()
    @IsOptional()
    analysis_id: number;

    @IsInt()
    @IsOptional()
    ai_id: number;

    @IsInt()
    @IsOptional()
    document_id: number;
}
