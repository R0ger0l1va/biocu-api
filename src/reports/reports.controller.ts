/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReporteEntity } from './entities/report.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Reports') // Agrupa todos los endpoints bajo el tag 'Reports'
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo reporte' })
  @ApiCreatedResponse({
    description: 'El reporte ha sido creado exitosamente',
  })
  @ApiBody({
    type: CreateReportDto,
    description: 'Datos necesarios para crear un nuevo reporte',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  create(@Body() createReportDto: CreateReportDto): Promise<ReporteEntity> {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los reportes' })
  @ApiOkResponse({
    description: 'Lista de reportes obtenida exitosamente',
  })
  findAll(): Promise<ReporteEntity[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un reporte por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reporte encontrado',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  findOne(@Param('id') id: string): Promise<ReporteEntity | null> {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un reporte por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del reporte a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reporte eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Reporte no encontrado',
  })
  remove(@Param('id') id: string): Promise<ReporteEntity> {
    return this.reportsService.remove(id);
  }
}
