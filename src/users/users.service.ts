/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly SALT_ROUNDS = 10;

  async create(createUserDto: CreateUserDto): Promise<UsuarioEntity> {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.usuarios.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(
      createUserDto.password_hash,
      this.SALT_ROUNDS,
    );

    try {
      return await this.prisma.usuarios.create({
        data: {
          nombre: createUserDto.nombre,
          email: createUserDto.email,
          password_hash: hashedPassword,
          es_admin: createUserDto.es_admin || false,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error al crear el usuario');
      }
      throw error;
    }
  }

  findAll(): Promise<UsuarioEntity[]> {
    return this.prisma.usuarios.findMany({
      include: {
        _count: {
          select: { reportes: true },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<UsuarioEntity> {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
      include: {
        reportes: {
          select: {
            titulo: true,
            direccion: true,
            descripcion: true,
            estado: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  findByEmail(email: string): Promise<UsuarioEntity | null> {
    return this.prisma.usuarios.findUnique({
      where: { email },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UsuarioEntity> {
    await this.findOne(id); // Verificar que el usuario existe

    if (updateUserDto.email) {
      const existingUser = await this.prisma.usuarios.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está en uso por otro usuario');
      }
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password_hash) {
      data.password_hash = await bcrypt.hash(
        updateUserDto.password_hash,
        this.SALT_ROUNDS,
      );
    }

    return this.prisma.usuarios.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<UsuarioEntity> {
    await this.findOne(id); // Verificar que el usuario existe

    return this.prisma.usuarios.delete({
      where: { id },
    });
  }

  async getUserReports(userId: string) {
    await this.findOne(userId); // Verificar que el usuario existe

    return this.prisma.reportes.findMany({
      where: { usuario_id: userId },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }
}
