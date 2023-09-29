import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//import { AuthModule } from './auth/auth.module';
//import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { AiModule } from './ai/ai.module';
import { KeyModule } from './key/key.module';
import { DocumentModule } from './document/document.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ResultModule } from './result/result.module';
import { FunctionalitiesModule } from './functionalities/functionalities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //AuthModule,
    //UserModule,
    PrismaModule,
    RoleModule,
    AiModule,
    KeyModule,
    DocumentModule,
    AnalysisModule,
    ResultModule,
    FunctionalitiesModule,
  ],
})
export class AppModule {}
