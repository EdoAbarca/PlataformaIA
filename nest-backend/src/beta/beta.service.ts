import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as mammoth from 'mammoth';
import * as pdf from 'pdf-parse';
import { HttpStatus } from '@nestjs/common';
import { Key } from '@prisma/client';

@Injectable()
export class BetaService {
  constructor(private prisma: PrismaService) { }

  async getAnalyses() {
    return await this.prisma.analysis.findMany({
      include: {
        documents: true
      }
    });
  }

  async getAnalysis(id: number) {
    return await this.prisma.analysis.findUnique({
      where: {
        id: id
      },
      include: {
        documents:{
          include: {
            results: {
              include: {
                ai: true
              }
            }
          }
        }
      }
    });
  }

  async createKey(body: any) {
    console.log(body.body);
    return await this.prisma.key.create({
      data: {
        api_key: body.body.api_key,
        ai_id: body.body.ai_id
      }
    });
  }

  async getKeys() {
    return await this.prisma.key.findMany({
      include: {
        ai: true
      }
    });
  };

  async editKey(id: number, key: string) {
    return await this.prisma.key.update({
      where: {
        id: id
      },
      data: {
        api_key: key
      }
    });
  }

  async deleteKey(id: number) {
    return await this.prisma.key.delete({
      where: {
        id: id
      }
    });
  }

  async getAIs() {
    return await this.prisma.aI.findMany();
  }

  async getFreeAIs() {
    return await this.prisma.aI.findMany({
      where: {
        is_free: true
      }
    });
  }

  async getPaidAIs() {
    const paidAIs = await this.prisma.aI.findMany({
      where: {
        is_free: false
      },
      include: {
        keys: true //Despues hay que verificar que la key sea del usuario
      }
    });

    return paidAIs.filter(ai => ai.keys.length > 0);
  }

  async getTags() {
    return await this.prisma.tag.findMany();
  }

  async deleteAnalysis(id: number) {
    return await this.prisma.analysis.delete({
      where: {
        id: id
      }
    });
  }

  async cascadeCleanDatabase() {
    await this.prisma.analysis.deleteMany();
    await this.prisma.aI.deleteMany();
  }

  async insertBaseData() { //A automatizar en un SQL (y docker)
    try {
      //Base data
      await this.prisma.aI.create({ data: { name: 'Originality', is_free: false } });
      await this.prisma.aI.create({ data: { name: 'ChatGPT (GPT-4)', is_free: false  } });
      await this.prisma.aI.create({ data: { name: 'Fast Detect GPT', is_free: true  } });
      await this.prisma.aI.create({ data: { name: 'Lm Watermarking', is_free: true  } });
      await this.prisma.aI.create({ data: { name: 'PoC AI Detector', is_free: true  } });


      //Temporal data
      let ai1 = await this.prisma.aI.findFirst({ where: { name: 'Originality' } });
      let ai2 = await this.prisma.aI.findFirst({ where: { name: 'ChatGPT (GPT-4)' } });
      let ai3 = await this.prisma.aI.findFirst({ where: { name: 'Fast Detect GPT' } });
      let ai4 = await this.prisma.aI.findFirst({ where: { name: 'Lm Watermarking' } });
      let ai5 = await this.prisma.aI.findFirst({ where: { name: 'PoC AI Detector' } });
      await this.prisma.key.create({ data: { api_key: "1234567890", ai_id: ai1.id } });
      await this.prisma.key.create({ data: { api_key: "0987654321", ai_id: ai2.id } });
      
      await this.prisma.analysis.create({
        data: {
          title: "Analysis 1",
          documents: {
            create: [
              {
                title: "Document 1",
                results: {
                  create: [
                    {
                      ai_score: 65,
                      ai_result: "Partly built by AI",
                      ai_id: ai1.id,
                    },
                    {
                      ai_score: 90,
                      ai_result: "Mostly AI",
                      ai_id: ai2.id,
                    },
                    {
                      ai_score: 100,
                      ai_result: "AI written",
                      ai_id: ai5.id,
                    }
                  ]
                }
              },
              {
                title: "Document 2",
                results: {
                  create: [
                    {
                      ai_score: 30,
                      ai_result: "Some AI",
                      ai_id: ai1.id,
                    },
                    {
                      ai_score: 12,
                      ai_result: "Likely human",
                      ai_id: ai2.id,
                    },
                    {
                      ai_score: 5,
                      ai_result: "Human written",
                      ai_id: ai5.id,
                    }
                  ]
                }
              }
            ]
          }
        }
      });

    } catch (error) {
      throw new HttpException('Error: ' + error, HttpStatus.BAD_REQUEST);
    }

  }

  trackDatabase() { //Inseguro, a borrar en futuros commits.
    console.log('Tracking database...');

    this.prisma.aI.findMany().then((data) => {
      console.log('AIs length: ', data.length);
      console.log('AIs: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.key.findMany().then((data) => {
      console.log('Keys length: ', data.length);
      console.log('Keys: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.analysis.findMany().then((data) => {
      console.log('Analyses length: ', data.length);
      console.log('Analysis: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.document.findMany().then((data) => {
      console.log('Documents length: ', data.length);
      console.log('Documents: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.result.findMany().then((data) => {
      console.log('Results length: ', data.length);
      console.log('Results: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
  }
  /* 
  async parseTesisDoc(res: Response) {
    try {
      const loader = new PDFLoader("./tesis.pdf", {
        splitPages: false,
      });
      const docs = await loader.load();
      return res.status(HttpStatus.OK).json(docs);
    } catch (error) {
      throw new HttpException('Error: ' + error, HttpStatus.BAD_REQUEST);
    }
  }*/
  // Sub funciones para proceso analisis
  // Extraer textos de documentos
  async extractTexts(docs: any) {
    console.log(docs);
    let texts = [];
    let texts_200 = [];
    
    try {
      const start_ext_text = performance.now();
      for (let i = 0; i < docs.length; i++) {
        let title = docs[i].originalname;
        let text = "";
        if (docs[i].mimetype === "application/pdf") { //Archivo es PDF
          console.log("Archivo " + i + ": PDF");
          try {
            console.log("Iniciado proceso de extracción de texto PDF...");
            const data = await pdf(docs[i].buffer);
            console.log("Texto extraido:");
            text = data.text;
            const doc = {title: title, text: text};
            //console.log(text);
            texts.push(doc);
          } catch (error) {
            throw new HttpException('Failed to extract text '+i+' from PDF. Error: '+error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
          console.log(pdf);
        } else { //Archivo es DOCX
          console.log("Archivo " + i + ": DOCX"); 
          try {
            const result = await mammoth.extractRawText({ buffer: docs[i].buffer });
            //console.log(result);
            text = result.value;
            //console.log(text);
            const doc = {title: title, text: text};
            texts.push(doc);
          } catch (error) {
            throw new HttpException('Failed to extract text '+i+' from DOCX. Error: '+error, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }
      const end_ext_text = performance.now();
      console.log("Tiempo de extracción de texto: "+(end_ext_text-start_ext_text)+" ms.");
      
      //Verificar primero si modelo fue seleccionado	
      //Preprocesamiento adicional para modelo PoC (Dividir cada texto en pedazos de 200 palabras)
      const start_divide_text = performance.now();
      for (let i = 0; i < texts.length; i++) {
        const title = texts[i].title;
        let text_200 = [];
        const words = texts[i].text.split(' ');
        let chunk = '';
        let chunkCount = 0;
        for (let j = 0; j < words.length; j++) {
          chunk += words[j] + ' ';
          chunkCount++;
          if (chunkCount === 200 || j === words.length - 1) {
            text_200.push(chunk.trim());
            chunk = '';
            chunkCount = 0;
          }
        }
        const doc = {title: title, text: text_200};
        texts_200.push(doc);
      }
      const end_divide_text = performance.now();
      console.log("Tiempo de dividir texto: "+(end_divide_text-start_divide_text)+" ms.");
      const response = {
        texts: texts,
        texts_200: texts_200,
        time: (end_divide_text-start_ext_text),
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error: ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyOriginality(api_key: string) {
    return fetch("https://api.originality.ai/api/v1/account/credits/balance",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-OAI-API-KEY": api_key
      }
    });
  }

  async verifyChatGPT(api_key: string) {
    return fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+api_key
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{role: "user", content: "Hi!"}],
        max_tokens: 5,
      }),
    });
  }

  async detectAIServiceOriginality(body: any){
    return fetch("https://api.originality.ai/api/v1/scan/ai",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-OAI-API-KEY": body.api_key
      },
      body: JSON.stringify({
        "title": body.title,
        "content": body.text,
      })
    });
  }

  async detectAIServiceChatGPT(body: any){
    const prompt = 'Quiero que actúes como un clasificador de texto experto en detección de IA. Te daré un texto, el cual clasificarás. Quiero que la salida esté en formato JSON, y sus campos sean el porcentaje de texto analizado que fué creado por IA ("ai_score"), la etiqueta de clasificación ("Human" si "ai_score" < 50, "AI" caso contrario) ("label") y quiero que almacenes en un arreglo los extractos del texto que crees fue hecho con IA ("ai_texts"). Aquí está el texto:';
    return fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+body.api_key
      },
      body: JSON.stringify({
        "model": "gpt-4",
        "messages": [
        {
            "role": "user",
            "content": prompt+body.text
        }
        ]
      }),
    });
  }

  async detectAIServiceFastDetectGPT(body: any){
    return fetch("http://localhost:8000/api/detect/fast-detect-gpt",{
      method: "POST",
      body: JSON.stringify({
        "text": body.text,
      })
    });
  }

  async detectAIServiceLmWatermarking(body: any){
    return fetch("http://localhost:8000/api/detect/lm-watermarking",{
      method: "POST",
      body: JSON.stringify({
        "text": body.text,
      })
    });
  }

  async detectAIServicePoC(body: any){
    return fetch("http://localhost:8000/api/detect/poc",{
      method: "POST",
      body: JSON.stringify({
        "text": body.text,
      })
    });
  }

  async createResult(body: any) {
    console.log(body);
    return await this.prisma.result.create({
      data: {
        ai_score: body.ai_score,
        ai_result: body.ai_result,
        ai_id: body.ai_id,
        document_id: body.document_id
      }
    });
  }

  async createAnalysis(body: any) {
    console.log(body);
    let ids = [];
    for (let i = 0; i < body.tags.length; i++) {
      ids.push(body.tags[i].id);
    }
    return await this.prisma.analysis.create({
      data: {
        title: body.title,
        tags: {
          connect: ids.map((id) => ({id: id})),
        }
      }
    });
  }
}
