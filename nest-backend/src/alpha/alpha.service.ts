import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlphaService {
  constructor(private prisma: PrismaService) { }

  async getAnalysis() {
    return await this.prisma.analysis.findMany({
      include: {
        documents: true
      }
    });
  }

  async getAnalysisDocs(id: number) {
    return await this.prisma.analysis.findUnique({
      where: {
        id: id
      }, 
      include: {
        documents: {
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
  
  async getKeys() {
    return await this.prisma.key.findMany({
      include: {
        ai: true
      }
    });
  };

  async getAIs() {
    return await this.prisma.aI.findMany();
  }

  async editKey(id: number, key: string) {
    return await this.prisma.key.update({
      where: {
        id: id
      },
      data: {
        ai_key: key
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

  async cascadeCleanDatabase() {
    await this.prisma.analysis.deleteMany();
    await this.prisma.aI.deleteMany();
  }

  async insertBaseData() {
    try {
      //Base data
      await this.prisma.aI.create({ data: { name: 'PoC AI' } });
      await this.prisma.aI.create({ data: { name: 'CopyLeaks' } });
      await this.prisma.aI.create({ data: { name: 'Originality' } });

      //Temporal data
      let ai1 = await this.prisma.aI.findFirst({ where: { name: 'PoC AI' } });
      let ai2 = await this.prisma.aI.findFirst({ where: { name: 'CopyLeaks' } });
      let ai3 = await this.prisma.aI.findFirst({ where: { name: 'Originality' } });
      await this.prisma.key.create({ data: { ai_key: "1234567890", ai_id: ai2.id } });
      await this.prisma.key.create({ data: { ai_key: "0987654321", ai_id: ai3.id } });

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
      throw new HttpException('Error: ' + error, 500);
    }

  }

  trackDatabase() { //Inseguro, a borrar en futuros commits.
    console.log('Tracking database...');

    this.prisma.aI.findMany().then((data) => {
      console.log('AIs lenght: ', data.length);
      console.log('AIs: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.key.findMany().then((data) => {
      console.log('Keys lenght: ', data.length);
      console.log('Keys: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.analysis.findMany().then((data) => {
      console.log('Analyses lenght: ', data.length);
      console.log('Analysis: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.document.findMany().then((data) => {
      console.log('Documents lenght: ', data.length);
      console.log('Documents: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
    this.prisma.result.findMany().then((data) => {
      console.log('Results lenght: ', data.length);
      console.log('Results: ', data);
    }, (err) => {
      console.log('Error: ', err);
    });
  }
}
