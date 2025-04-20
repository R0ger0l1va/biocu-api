import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt-constant';
import { GoogleAuthService } from './google-auth.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from 'src/common/google/google.trategy';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService, GoogleStrategy],
})
export class AuthModule {}
