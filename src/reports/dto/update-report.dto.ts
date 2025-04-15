/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
  MaxLength,
  IsUrl,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateReportDto {
  @ApiProperty({
    description: 'Título del reporte',
    example: 'Bache en calle principal reparado',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  titulo?: string;

  @ApiProperty({
    description: 'Dirección exacta del problema',
    example: 'Calle Principal 123, Colonia Centro',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiProperty({
    description: 'Descripción detallada del problema',
    example: 'Bache reparado pero el material no es de buena calidad',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Latitud geográfica',
    example: '19.4326018',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value).toFixed(8))
  latitud?: string;

  @ApiProperty({
    description: 'Longitud geográfica',
    example: '-99.1332049',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value).toFixed(8))
  longitud?: string;

  @ApiProperty({
    description: 'URL de la imagen del reporte',
    example: 'https://ejemplo.com/bache-reparado.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imagen_url?: string;

  @ApiProperty({
    description: 'Estado del reporte',
    example: 'revisado',
    enum: ['revisado', 'sin_revisar'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['revisado', 'sin_revisar'])
  estado?: string;
}
