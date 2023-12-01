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
import { MethodsService } from './methods.service';
//import { JwtGuard } from '../auth/guard';

@Controller('api/final')
export class MethodsController {
    constructor(private methodsService: MethodsService) { }

    /* 
    @Get('keys/:idUser')
    getUserKeys(@Param('idUser', ParseIntPipe) idUser: number) {
        return this.functionalitiesService.getUserKeys(idUser);
    }

    @Post('keys/:idUser')
    createUserKey(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Body() createKeyDto: CreateKeyDto,
    ) {
        return this.functionalitiesService.createUserKey(idUser, createKeyDto);
    }

    @Delete('keys/:idUser/:idKey')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUserKey(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Param('idKey', ParseIntPipe) idKey: number,
    ) {
        return this.functionalitiesService.deleteUserKey(idUser, idKey);
    }

    @Get('analysis/:idUser')
    getUserAnalysis(@Param('idUser', ParseIntPipe) idUser: number) {
        return this.functionalitiesService.getUserAnalysis(idUser);
    }

    @Get('analysis/:idUser/:idAnalysis')
    getUserDocumentsByAnalysis(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Param('idAnalysis', ParseIntPipe) idAnalysis: number,
    ) {
        return this.functionalitiesService.getUserDocumentsByAnalysis(idUser, idAnalysis);
    }

    @Get('analysis/:idUser/:idAnalysis/:idDocument')
    getAnalysisDocument(
        @Param('idAnalysis', ParseIntPipe) idAnalysis: number,
        @Param('idDocument', ParseIntPipe) idDocument: number,
    ) {
        return this.functionalitiesService.getAnalysisDocument(idAnalysis, idDocument);
    }

    @Delete('analysis/:idUser/:idAnalysis')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUserAnalysis(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Param('idAnalysis', ParseIntPipe) idAnalysis: number,
    ) {
        return this.functionalitiesService.deleteUserAnalysis(idUser, idAnalysis);
    }

    @Post('analysis/:idUser')
    async createUserAnalysis(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Body() createAnalysisDto: CreateAnalysisDto,
        @Body() createDocumentsDto: CreateDocumentDto[],
    ) {
        return this.functionalitiesService.createUserAnalysis(idUser, createAnalysisDto, createDocumentsDto);
    }*/
}
