/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'Titulo del Reporte',
    example: 'Projecto Ambiental ',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}
