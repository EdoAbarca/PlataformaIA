import {
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class EditRoleDto {
    @IsString()
    @IsOptional()
    name?: string;
  }