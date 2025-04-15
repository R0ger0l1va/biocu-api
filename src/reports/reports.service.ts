/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReporteEntity } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<ReporteEntity> {
    let images: string[] = [];

    if (createReportDto.imagenes && createReportDto.imagenes.length > 0) {
      images = await this.fileService.saveUserImages(
        createReportDto.usuario_id,
        createReportDto.imagenes,
      );
    }
    return this.prisma.reportes.create({
      data: {
        titulo: createReportDto.titulo,
        direccion: createReportDto.direccion,
        descripcion: createReportDto.descripcion,
        latitud: parseFloat(createReportDto.latitud),
        longitud: parseFloat(createReportDto.longitud),
        imagenes: images,
        usuario_id: createReportDto.usuario_id,
        estado: 'sin_revisar', // Estado por defecto
      },
    });
  }

  findAll(): Promise<ReporteEntity[]> {
    return this.prisma.reportes.findMany({
      include: {
        usuarios: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<ReporteEntity | null> {
    const reporte = await this.prisma.reportes.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    return reporte;
  }

  async update(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<ReporteEntity> {
    await this.findOne(id); // Verifica que el reporte exista

    return this.prisma.reportes.update({
      where: { id },
      data: {
        titulo: updateReportDto.titulo,
        direccion: updateReportDto.direccion,
        descripcion: updateReportDto.descripcion,
        latitud: updateReportDto.latitud
          ? parseFloat(updateReportDto.latitud)
          : undefined,
        longitud: updateReportDto.longitud
          ? parseFloat(updateReportDto.longitud)
          : undefined,
        imagenes: updateReportDto.imagenes,
      },
    });
  }

  async remove(id: string): Promise<ReporteEntity> {
    await this.findOne(id); // Verifica que el reporte exista

    return this.prisma.reportes.delete({
      where: { id },
    });
  }

  findByUser(userId: string): Promise<ReporteEntity[]> {
    return this.prisma.reportes.findMany({
      where: { usuario_id: userId },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }

  async changeReportStatus(
    id: string,
    status: 'revisado' | 'sin_revisar',
  ): Promise<ReporteEntity> {
    await this.findOne(id); // Verifica que el reporte exista

    return this.prisma.reportes.update({
      where: { id },
      data: { estado: status },
    });
  }
}
