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

        @Get('key')
        getKeys(){
            return this.alphaService.getKeys();
        }

        @Patch('key/:id')
        editKey(@Param('id', ParseIntPipe) id: number, @Body() body: any){
            return this.alphaService.editKey(id, body.key);
        }

        @Get('analysis/:id')
        getAnalysisDocs(@Param('id', ParseIntPipe) id: number){
            return this.alphaService.getAnalysisDocs(id);
        }

        @Get('ai')
        getAIs(){
            return this.alphaService.getAIs();
        }

        @Delete('key/:id')
        deleteKey(@Param('id', ParseIntPipe) id: number){
            return this.alphaService.deleteKey(id);
        }
}
