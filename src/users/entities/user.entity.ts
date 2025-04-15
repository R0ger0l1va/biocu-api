import { usuarios as PrismaUsuarios } from '@prisma/client';

export type UsuarioEntity = PrismaUsuarios;

export type CreateUserEntity = Omit<UsuarioEntity, 'id' | 'fecha_creacion'>;
