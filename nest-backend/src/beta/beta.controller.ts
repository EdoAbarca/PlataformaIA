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
  UploadedFiles,
  UseInterceptors
  //UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BetaService } from './beta.service';
//import { JwtGuard } from '../auth/guard';

@Controller('beta/final')
export class BetaController {
  constructor(private betaService: BetaService) { }

  //Temporal, a automatizar en script SQL y luego eliminar
  @Post('database')
  insertBaseData() {
    return this.betaService.insertBaseData();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('database')
  deleteBaseData() {
    return this.betaService.cascadeCleanDatabase();
  }
  //Funcionalidades
  @Get('analysis')
  getAnalyses() {
    return this.betaService.getAnalyses();
  }

  @Post('key')
  createKey(@Body() body: any) {
    return this.betaService.createKey(body);
  }

  @Get('key')
  getKeys() {
    return this.betaService.getKeys();
  }
  //Propenso a ser descartado
  @Patch('key/:id')
  editKey(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.betaService.editKey(id, body.key);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('key/:id')
  deleteKey(@Param('id', ParseIntPipe) id: number) {
    return this.betaService.deleteKey(id);
  }

  @Get('analysis/:id')
  getAnalysis(@Param('id', ParseIntPipe) id: number) {
    return this.betaService.getAnalysis(id);
  }

  //Probablemente se descarte (no hace distinción entre IAs gratuitas y pagadas)
  @Get('ai')
  getAIs() {
    return this.betaService.getAIs();
  }
   
  @Get('ai/free')
  getFreeAIs() {
    return this.betaService.getFreeAIs();
  }

  @Get('tag')
  getTags() {
    return this.betaService.getTags();
  }

  @Post('tag')
  createTag(@Body() body: any) {
    return this.betaService.createTag(body);
  }

  /**
  @Get('ai/paid')
  getPaidAIs() {
    return this.betaService.getPaidAIs();
  }*/

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('analysis/:id')
  deleteAnalysis(@Param('id', ParseIntPipe) id: number) {
    return this.betaService.deleteAnalysis(id);
  }

  @Post('analysis')
  async createAnalysis(@Body() body: any) {
    return this.betaService.createAnalysis(body);
  }

  @Post('document')
  createDocument(@Body() body: any) {
    return this.betaService.createDocument(body);
  }

  @Post('result')
  async createResult(@Body() body: any) {
    return this.betaService.createResult(body);
  }
  

  //Funciones asociadas a proceso análisis
  //Verificar estado api key Originality
  @HttpCode(HttpStatus.OK)
  @Post('check/originality')
  async checkOriginality(@Body() body: any) {
    return this.betaService.verifyOriginality(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check/chatgpt')
  async checkChatGPT(@Body() body: any) {
    return this.betaService.verifyChatGPT(body);
  }

  //Verificar estado api key ChatGPT

  //Titulo, keys y documentos verificados previo analisis, proceso es viable
  //Extraer texto de documentos
  @HttpCode(HttpStatus.OK)
  @Post('files')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'documents' }]))
  async extractTextFromDocuments(@UploadedFiles() files: any) {
    return this.betaService.extractTexts(files.documents);
  }

  //Llamada a detector externo Originality
  @HttpCode(HttpStatus.OK)
  @Post('detect/originality')
  async detectOriginality(@Body() body: any) {
    return this.betaService.detectAIServiceOriginality(body);
  }

  //Llamada a detector externo ChatGPT (GPT-4)
  @HttpCode(HttpStatus.OK)
  @Post('detect/chatgpt')
  async detectChatGPT(@Body() body: any) {
    return this.betaService.detectAIServiceChatGPT(body);
  }

  //Llamada a detector interno OUTFOX
  @HttpCode(HttpStatus.OK)
  @Post('detect/outfox')
  async detectOutfox(@Body() body: any) {
    //return this.betaService.detectAIServiceOutfox(body);
  }

  //Llamada a detector interno AI Watermark D.
  @HttpCode(HttpStatus.OK)
  @Post('detect/aiwatermark')
  async detectAIWatermark(@Body() body: any) {
    //return this.betaService.detectAIServiceAIWatermark(body);
  }

  //Llamada a detector interno PoC AI Detector
  @HttpCode(HttpStatus.OK)
  @Post('detect/poc-ai-detector')
  async detectPoCAIDetector(@Body() body: any) {
    //return this.betaService.detectAIServicePoCAIDetector(body);
  }
}

 // Originality
    /*
    const headersOriginality = {
        "Content-Type": "application/json",
        "X-OAI-API-KEY": "tjldnmapye4fshxrg6b0i9czqv3ou51k"
    };
    for (let i = 0; i < texts.length; i++) {
      const OriginalityResponse = await fetch("https://api.originality.ai/api/v1/scan/ai",{
        method: "POST",
        headers: headersOriginality,
        body: JSON.stringify({
        "title": docs[i].originalname,
        "content": texts[i],
        })
    });
    const OriginalityData = await OriginalityResponse.json();
    console.log(OriginalityData);
    }
     */
    
    // ChatGPT (GPT-4)
    /*
    const headersChatGPT = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+chatgptkey.api_key
    };
    const promptChatGPT = "Quiero que actúes como un clasificador de texto experto en detección de IA. Te daré un texto, el cual clasificarás. Quiero que la salidas sean las etiquetas de clasificación (Humano o IA) con su porcentaje respectivo, y quiero que vuelvas a escribir el texto que crees fue hecho con IA. Aquí está el texto: ";
    const bodyChatGPT = {
        "model": "gpt-4",
        "messages": [
        {
            "role": "user",
            "content": promptChatGPT+texts[i]
        }
        ]
    }
    const ChatGPTResponse = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: headersChatGPT,
        body: bodyChatGPT,
    });
    const ChatGPTData = await ChatGPTResponse.json();
    console.log(ChatGPTData);
     */
    