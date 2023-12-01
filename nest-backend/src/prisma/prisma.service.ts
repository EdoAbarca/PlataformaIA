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
    await this.aI.create({ data: { name: 'PoC AI' } });
    await this.aI.create({ data: { name: 'CopyLeaks' } });
    await this.aI.create({ data: { name: 'Originality' } });

    //Temporal data
    let ai1 = await this.aI.findFirst({ where: { name: 'PoC AI' } });
    let ai2 = await this.aI.findFirst({ where: { name: 'CopyLeaks' } });
    let ai3 = await this.aI.findFirst({ where: { name: 'Originality' } });
    await this.key.create({ data: { api_key: "1234567890", api_email:"ejemail1@gmail.com", ai_id: ai2.id } });
    await this.key.create({ data: { api_key: "0987654321", api_email:"ejemail2@gmail.com", ai_id: ai3.id } });

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
  }
}
