/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsLatitude,
  IsLongitude,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReportDto {
  @ApiProperty({
    description: 'Título del reporte',
    example: 'Bache en calle principal',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo: string;

  @ApiProperty({
    description: 'Dirección exacta del problema',
    example: 'Calle Principal 123, Colonia Centro',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  direccion: string;

  @ApiProperty({
    description: 'Descripción detallada del problema',
    example: 'Bache de aproximadamente 1m de diámetro y 30cm de profundidad',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Latitud geográfica',
    example: '19.4326018',
    type: String,
  })
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value).toFixed(8))
  latitud: string;

  @ApiProperty({
    description: 'Longitud geográfica',
    example: '-99.1332049',
    type: String,
  })
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value).toFixed(8))
  longitud: string;

  @ApiProperty({
    description: 'URL de la imagen del reporte',
    example: 'https://ejemplo.com/bache.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imagen_url?: string;

  @ApiProperty({
    description: 'ID del usuario que crea el reporte',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  usuario_id: string;
}
