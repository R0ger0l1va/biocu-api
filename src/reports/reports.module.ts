// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importa el PrismaModule

@Module({
  imports: [PrismaModule], // Añade esta línea
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
