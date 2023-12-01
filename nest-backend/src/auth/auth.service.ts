import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { SignUpDto, SignInDto } from './dto';
  import * as argon from 'argon2';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
    async signup(dto: SignUpDto) {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      try {
        const user = await this.prisma.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            password: hash,
          },
        });
  
        //return this.signToken(user.id, user.email);
        return {"usuario":user, "token":this.signToken(user.id, user.email)}
      } catch (error) {
        if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Credenciales ya están en uso',
            );
          }
        }
        throw error;
      }
    }
  
    async signin(dto: SignInDto) {
      // find the user by email
      const user =
        await this.prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });
      // if user does not exist throw exception
      if (!user)
        throw new ForbiddenException(
          'Usuario no encontrado',
        );
  
      // compare password
      const pwMatches = await argon.verify(
        user.password,
        dto.password,
      );
      // if password incorrect throw exception
      if (!pwMatches)
        throw new ForbiddenException(
          'Contraseña incorrecta',
        );
      return this.signToken(user.id, user.email);
    }
  
    async signToken(
      userId: number,
      email: string,
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '15m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }