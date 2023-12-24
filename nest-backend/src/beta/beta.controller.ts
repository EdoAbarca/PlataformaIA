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
import { BetaService } from './beta.service';
//import { JwtGuard } from '../auth/guard';

@Controller('beta/final')
export class BetaController {
    constructor(private betaService: BetaService){}

    //Temporal, a automatizar en script SQL y luego eliminar
    @Post('database')
    insertBaseData(){
        return this.betaService.insertBaseData();    
    }

    @Delete('database')
    deleteBaseData(){
        return this.betaService.cascadeCleanDatabase();    
    }
    //Funcionalidades
    @Get('analysis')
    getAnalysis(){
        return this.betaService.getAnalysis();
    }

    @Post('key')
    createKey(@Body() body: any){
        return this.betaService.createKey(body);
    }

    @Get('key')
    getKeys(){
        return this.betaService.getKeys();
    }

    @Patch('key/:id')
    editKey(@Param('id', ParseIntPipe) id: number, @Body() body: any){
        return this.betaService.editKey(id, body.key);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('key/:id')
    deleteKey(@Param('id', ParseIntPipe) id: number){
        return this.betaService.deleteKey(id);
    }

    @Get('analysis/:id')
    getAnalysisDocs(@Param('id', ParseIntPipe) analysis_id: number){
        return this.betaService.getAnalysisDocs(analysis_id);
    }

    @Get('ai')
    getAIs(){
        return this.betaService.getAIs();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('analysis/:id')
    deleteAnalysis(@Param('id', ParseIntPipe) id: number){
        return this.betaService.deleteAnalysis(id);
    }

    @Get('parse_doc')
    parseTesisDoc(@Res() res: Response){
        return this.betaService.parseTesisDoc(res);
    }

    @Post('analysis')
    createAnalysis(@Body() body: any){
        return this.betaService.createAnalysis(body);
    }
}

