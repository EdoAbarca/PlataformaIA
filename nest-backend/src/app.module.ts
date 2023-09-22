import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//import { AuthModule } from './auth/auth.module';
//import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //AuthModule,
    //UserModule,
    PrismaModule,
    RoleModule,
  ],
})
export class AppModule {}
