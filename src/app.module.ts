import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FileService } from './file/file.service';

@Module({
  imports: [AuthModule, ReportsModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
