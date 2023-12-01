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
    Res,
    //UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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

        @Post('key')
        createKey(@Body() body: any){
            return this.alphaService.createKey(body);
        }

        @Get('key')
        getKeys(){
            return this.alphaService.getKeys();
        }

        @Patch('key/:id')
        editKey(@Param('id', ParseIntPipe) id: number, @Body() body: any){
            return this.alphaService.editKey(id, body.key);
        }

        @HttpCode(HttpStatus.NO_CONTENT)
        @Delete('key/:id')
        deleteKey(@Param('id', ParseIntPipe) id: number){
            return this.alphaService.deleteKey(id);
        }

        @Get('analysis/:id')
        getAnalysisDocs(@Param('id', ParseIntPipe) analysis_id: number){
            return this.alphaService.getAnalysisDocs(analysis_id);
        }

        @Get('ai')
        getAIs(){
            return this.alphaService.getAIs();
        }

        @HttpCode(HttpStatus.NO_CONTENT)
        @Delete('analysis/:id')
        deleteAnalysis(@Param('id', ParseIntPipe) id: number){
            return this.alphaService.deleteAnalysis(id);
        }

        @Get('parse_doc')
        parseTesisDoc(@Res() res: Response){
            return this.alphaService.parseTesisDoc(res);
        }

        @Post('analysis')
        createAnalysis(@Body() body: any){
            return this.alphaService.createAnalysis(body);
        }
}
