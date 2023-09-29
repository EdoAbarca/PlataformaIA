import {
    IsNotEmpty,
    IsString,
    IsInt,
} from 'class-validator';

export class CreateResultDto {
    @IsInt()
    @IsNotEmpty()
    ia_score: number;

    @IsString()
    @IsNotEmpty()
    ia_result: string;

    @IsInt()
    @IsNotEmpty()
    analysis_id: number;

    @IsInt()
    @IsNotEmpty()
    ai_id: number;

    @IsInt()
    @IsNotEmpty()
    document_id: number;
}
