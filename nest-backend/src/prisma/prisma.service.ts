import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  async cleanDb() {
    this.analysis.deleteMany();
    this.aI.deleteMany();
  }
  async fillDb() { //Aquí se hará el llenado de la db
    //Base data
    await this.aI.create({ data: { name: 'Originality', is_free: false } });
    await this.aI.create({ data: { name: 'ChatGPT (GPT-4)', is_free: false } });
    await this.aI.create({ data: { name: 'OUTFOX', is_free: true } });
    await this.aI.create({ data: { name: 'AI Watermark D.', is_free: true } });
    await this.aI.create({ data: { name: 'PoC AI Detector', is_free: true } });


    //Temporal data
    let ai1 = await this.aI.findFirst({ where: { name: 'Originality' } });
    let ai2 = await this.aI.findFirst({ where: { name: 'ChatGPT (GPT-4)' } });
    let ai3 = await this.aI.findFirst({ where: { name: 'OUTFOX' } });
    let ai4 = await this.aI.findFirst({ where: { name: 'AI Watermark D.' } });
    let ai5 = await this.aI.findFirst({ where: { name: 'PoC AI Detector' } });
    await this.key.create({ data: { api_key: "1234567890", ai_id: ai1.id } });
    await this.key.create({ data: { api_key: "0987654321", ai_id: ai2.id } });

    await this.analysis.create({
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
  }
}
