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
    //UseGuards,
} from '@nestjs/common';
import { AlphaService } from './alpha.service';
//import { JwtGuard } from '../auth/guard';

@Controller('alpha/final')
export class AlphaController {
    constructor(private alphaService: AlphaService){}
        //Temporales
        @HttpCode(HttpStatus.NO_CONTENT)
        @Delete('database')
        cascadeCleanDatabase(){
            return this.alphaService.cascadeCleanDatabase();
        }

        @Get('database')
        trackDatabase(){
            return this.alphaService.trackDatabase();
        }

        //Datos de prueba
        @Post('database')
        InsertBaseData(){
            return this.alphaService.insertBaseData();
        }

        //Funcionalidades
        @Get('analysis')
        getAnalysis(){
            return this.alphaService.getAnalysis();
        }

        @Get('keys')
        getKeys(){
            return this.alphaService.getKeys();
        }

        @Get('analysis/:id')
        getAnalysisDocs(@Param('id', ParseIntPipe) id: number){
            return this.alphaService.getAnalysisDocs(id);
        }
}
