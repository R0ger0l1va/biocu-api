import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2023-05-20T10:30:00Z',
    required: false,
  })
  updatedAt?: Date;
}
