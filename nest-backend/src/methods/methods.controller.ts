import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { MethodsService } from './methods.service';
import { JwtGuard } from '../auth/guard';

//@UseGuards(JwtGuard)
@Controller('api/final')
export class MethodsController {
    constructor(private methodsService: MethodsService) { }
}
