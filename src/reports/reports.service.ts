/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReporteEntity } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  create(createReportDto: CreateReportDto): Promise<ReporteEntity> {
    return this.prisma.reports.create({
      data: {
        title: createReportDto.title,
        //El UUID se generara automaticamente
      },
    });
  }

  findAll(): Promise<ReporteEntity[]> {
    return this.prisma.reports.findMany();
  }

  findOne(id: string): Promise<ReporteEntity | null> {
    return this.prisma.reports.findUnique({
      where: { id },
    });
  }

  remove(id: string): Promise<ReporteEntity> {
    return this.prisma.reports.delete({
      where: { id },
    });
  }
}
