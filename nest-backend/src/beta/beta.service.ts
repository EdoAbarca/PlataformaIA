import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class BetaService {
  constructor(private prisma: PrismaService) { }

  async getAnalysis() {
    return await this.prisma.analysis.findMany({
      include: {
        documents: true
      }
    });
  }

  async getAnalysisDocs(analysis_id: number) {
    return await this.prisma.document.findMany({
      where: {
        analysis_id: analysis_id
      },
      include: {
        results: {
          include: {
            ai: true
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
        api_email: body.body.api_email,
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

  async deleteAnalysis(id: number) {
    return await this.prisma.analysis.delete({
      where: {
        id: id
      }
    });
  }

  async createAnalysis(body: any) { 
    
    /*
    {
      title: "Analysis 1",
      documents: [{
        title: "doc1",
        results: [{
          ia_score: 65,
          ia_result: "Partly built by AI",
          ai_id: 1,
        },
        {
          ia_score: 90,
          ia_result: "Mostly AI",
          ai_id: 2,
        },
        {
          ia_score: 100,
          ia_result: "AI written",
          ai_id: 3,
        }]
      }]
    }
    */
    console.log(body);

    return await this.prisma.analysis.create({
      data: {
        title: body.title,
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
      await this.prisma.aI.create({ data: { name: 'PoC AI' } });
      await this.prisma.aI.create({ data: { name: 'CopyLeaks' } }); //F
      await this.prisma.aI.create({ data: { name: 'Originality' } });
      
      
      
      //Temporal data
      let ai1 = await this.prisma.aI.findFirst({ where: { name: 'PoC AI' } });
      let ai2 = await this.prisma.aI.findFirst({ where: { name: 'CopyLeaks' } });
      let ai3 = await this.prisma.aI.findFirst({ where: { name: 'Originality' } });
      await this.prisma.key.create({ data: { api_key: "1234567890", api_email: "ejemail1@gmail.com", ai_id: ai2.id } });
      await this.prisma.key.create({ data: { api_key: "0987654321", api_email: "ejemail2@gmail.com", ai_id: ai3.id } });

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
                      ia_score: 65,
                      ia_result: "Partly built by AI",
                      ai_id: ai1.id,
                    },
                    {
                      ia_score: 90,
                      ia_result: "Mostly AI",
                      ai_id: ai2.id,
                    },
                    {
                      ia_score: 100,
                      ia_result: "AI written",
                      ai_id: ai3.id,
                    }
                  ]
                }
              },
              {
                title: "Document 2",
                results: {
                  create: [
                    {
                      ia_score: 30,
                      ia_result: "Some AI",
                      ai_id: ai1.id,
                    },
                    {
                      ia_score: 12,
                      ia_result: "Likely human",
                      ai_id: ai2.id,
                    },
                    {
                      ia_score: 5,
                      ia_result: "Human written",
                      ai_id: ai3.id,
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
  }
}
