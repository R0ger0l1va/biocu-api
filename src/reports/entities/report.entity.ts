import { reports as PrismaReporte } from '@prisma/client';

export type ReporteEntity = PrismaReporte;

export type CreateReportEntity = Omit<ReporteEntity, 'id' | 'create_time'>;
