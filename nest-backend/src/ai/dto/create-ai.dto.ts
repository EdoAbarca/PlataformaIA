//import { Key, Result } from '@prisma/client';
import {
    IsNotEmpty,
    IsString,
    IsArray,
} from 'class-validator';

export class CreateAIDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    /* 
    @IsArray()
    key: Key[];

    @IsArray()
    results: Result[];*/
}